import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { publicClient } from '@/lib/blockchain';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// SafeHarvestNFT ABI (分成兩個函數避免 stack too deep)
const PROJECT_ABI = [
  {
    inputs: [],
    name: 'getProjectData1',
    outputs: [
      { name: 'currentStatus', type: 'uint8' },
      { name: 'projectOwner', type: 'address' },
      { name: 'projectFarmer', type: 'address' },
      { name: 'nftTotalSupply', type: 'uint256' },
      { name: 'nftMintedCount', type: 'uint256' },
      { name: 'nftPricePerUnit', type: 'uint256' },
      { name: 'projectBuildCost', type: 'uint256' },
      { name: 'projectAnnualIncome', type: 'uint256' },
      { name: 'projectInvestorShare', type: 'uint256' },
      { name: 'projectInterestRate', type: 'uint256' },
      { name: 'projectPremiumRate', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * POST /api/projects/syncNftData
 * 從鏈上同步 NFT minted 數量到 DB
 * Request body: { projectId: string }
 * 
 * 更新邏輯：
 * - minted_nft = nftMintedCount (從鏈上讀取)
 * - funded_nft = minted_nft
 * - funded_amount = minted_nft * 10
 */
export async function POST(request: NextRequest) {
  if (!uri || !dbName) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    // 驗證 ObjectId 格式
    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: 'Invalid ObjectId format' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('projects');

      // 查詢專案取得 contract_address
      const project = await collection.findOne({ _id: new ObjectId(projectId) });

      if (!project) {
        return NextResponse.json({ error: 'Project not found in DB' }, { status: 404 });
      }

      const contractAddress = project.contract_address;
      if (!contractAddress) {
        return NextResponse.json(
          { error: 'Project does not have a contract address' },
          { status: 400 }
        );
      }

      // 從鏈上讀取專案資料 (使用 getProjectData1)
      const data = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: PROJECT_ABI,
        functionName: 'getProjectData1',
        args: [],
      });

      // data[4] 是 nftMintedCount
      const nftMintedCount = Number(data[4]);
      const fundedAmount = nftMintedCount * 10;

      // 更新 DB
      const updateResult = await collection.updateOne(
        { _id: new ObjectId(projectId) },
        {
          $set: {
            minted_nft: nftMintedCount,
            funded_nft: nftMintedCount,
            funded_amount: fundedAmount,
            updated_at: new Date(),
          },
        }
      );

      if (updateResult.matchedCount === 0) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        projectId,
        contractAddress,
        nftMintedCount,
        fundedAmount,
        message: 'NFT data synced successfully',
      });
    } finally {
      try { await client.close(); } catch {}
    }
  } catch (error: any) {
    console.error('[Sync NFT Data] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

