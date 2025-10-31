import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { walletClient, publicClient, BANK_FACTORY_ADDRESS, TWDT_ADDRESS } from '@/lib/blockchain';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

interface ApproveRequest {
  projectId: string;
  action: 'approve' | 'reject';
  adminNotes?: string;
  // 審核通過後需要填入的參數
  totalNFTs?: number;
  nftPrice?: number;
  farmerAddress?: string;
}

// BankFactory ABI
const BANK_FACTORY_ABI = [
  {
    inputs: [
      { name: 'name_', type: 'string' },
      { name: 'symbol_', type: 'string' },
      { name: 'farmer_', type: 'address' },
      { name: 'totalNFTs', type: 'uint256' },
      { name: 'nftPrice', type: 'uint256' },
      { name: 'buildCost', type: 'uint256' },
      { name: 'annualIncome', type: 'uint256' },
      { name: 'investorShare', type: 'uint256' },
      { name: 'interestRate', type: 'uint256' },
      { name: 'premiumRate', type: 'uint256' },
    ],
    name: 'createProject',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/projects/approve
 * Admin 審核並部署專案到鏈上
 */
export async function POST(request: NextRequest) {
  try {
    const body: ApproveRequest = await request.json();
    const { projectId, action } = body;

    if (!projectId || !action) {
      return NextResponse.json(
        { error: 'Missing projectId or action' },
        { status: 400 }
      );
    }

    // 連線 MongoDB
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    // 查詢專案
    const project = await collection.findOne({ _id: new ObjectId(projectId) });

    if (!project) {
      await client.close();
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // 如果拒絕
    if (action === 'reject') {
      await collection.updateOne(
        { _id: new ObjectId(projectId) },
        {
          $set: {
            admin_agree: false,
            status_display: '已拒絕',
            funding_status: 'CLOSED',
            admin_notes: body.adminNotes || '',
            updated_at: new Date(),
          },
        }
      );
      await client.close();
      return NextResponse.json({ ok: true, message: '專案已拒絕' });
    }

    // 如果審核通過，需要部署到鏈上
    if (action === 'approve') {
      // 驗證必填參數
      if (!body.totalNFTs || !body.nftPrice || !body.farmerAddress) {
        return NextResponse.json(
          { error: 'Missing deployment parameters: totalNFTs, nftPrice, farmerAddress' },
          { status: 400 }
        );
      }

      // 注意：BankFactory.createProject 內部會檢查工廠餘額是否足夠
      // 資金不足會自動 revert，不需要在這裡檢查

      // 部署合約
      const hash = await walletClient.writeContract({
        address: BANK_FACTORY_ADDRESS as `0x${string}`,
        abi: BANK_FACTORY_ABI,
        functionName: 'createProject',
        args: [
          project.title,
          `GH-${project.title.substring(0, 3).toUpperCase()}`,
          body.farmerAddress as `0x${string}`,
          BigInt(body.totalNFTs),
          BigInt(body.nftPrice) * BigInt(10 ** 6),  // 轉換為 6 decimals
          BigInt(project.build_cost) * BigInt(10 ** 6),
          BigInt(project.annual_income) * BigInt(10 ** 6),
          BigInt(project.investor_share),
          BigInt(project.interest_rate),
          BigInt(project.premium_rate),
        ],
      });

      // 等待交易確認
      await publicClient.waitForTransactionReceipt({ hash });

      // 從工廠取得最新部署的合約地址
      const factoryAbi2 = [
        {
          inputs: [],
          name: 'getAllProjects',
          outputs: [{ name: '', type: 'address[]' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const;

      const allProjects = await publicClient.readContract({
        address: BANK_FACTORY_ADDRESS as `0x${string}`,
        abi: factoryAbi2,
        functionName: 'getAllProjects',
        args: [],
      });
      
      // 最新部署的地址在陣列最後
      const contractAddress = allProjects[allProjects.length - 1];

      // 更新資料庫
      await collection.updateOne(
        { _id: new ObjectId(projectId) },
        {
          $set: {
            admin_agree: true,
            status_on_chain: 'ACTIVE',
            funding_status: 'OPENING',
            status_display: '開放中',
            total_nft: body.totalNFTs,
            nft_price: body.nftPrice,
            contract_address: contractAddress,
            factory_address: BANK_FACTORY_ADDRESS,
            payment_token_address: TWDT_ADDRESS,
            farmer_address: body.farmerAddress,
            deployment_tx_hash: hash,
            deployed_at: new Date(),
            updated_at: new Date(),
          },
        }
      );

      await client.close();
      return NextResponse.json({ 
        ok: true, 
        txHash: hash,
        message: '專案已審核通過並部署' 
      });
    }

    await client.close();
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[Approve Project] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

