import { NextRequest, NextResponse } from 'next/server';
import { publicClient } from '@/lib/blockchain';

// SafeHarvestNFT ABI
// SafeHarvestNFT ABI（合約分成 getProjectData1 和 getProjectData2）
const PROJECT_ABI_1 = [
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

const PROJECT_ABI_2 = [
  {
    inputs: [],
    name: 'getProjectData2',
    outputs: [
      { name: 'projectCurrentYear', type: 'uint256' },
      { name: 'projectCumulativePrincipal', type: 'uint256' },
      { name: 'projectRemainingPrincipal', type: 'uint256' },
      { name: 'projectBuybackPrice', type: 'uint256' },
      { name: 'projectBuybackActive', type: 'bool' },
      { name: 'projectPaymentToken', type: 'address' },
      { name: 'projectFactory', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * GET /api/contract/project/data?projectAddress=0x...
 * 查詢專案完整資料
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectAddress = searchParams.get('projectAddress');

    if (!projectAddress) {
      return NextResponse.json(
        { error: 'Missing projectAddress parameter' },
        { status: 400 }
      );
    }

    // 分兩次 call 合約取得完整資料
    const data1 = await publicClient.readContract({
      address: projectAddress as `0x${string}`,
      abi: PROJECT_ABI_1,
      functionName: 'getProjectData1',
      args: [],
    });

    const data2 = await publicClient.readContract({
      address: projectAddress as `0x${string}`,
      abi: PROJECT_ABI_2,
      functionName: 'getProjectData2',
      args: [],
    });

    // Format response with human readable values (6 decimals)
    const decimals = 6;
    const formattedData = {
      // From getProjectData1
      currentStatus: data1[0],
      projectOwner: data1[1],
      projectFarmer: data1[2],
      nftTotalSupply: data1[3].toString(),
      nftMintedCount: data1[4].toString(),
      nftPricePerUnit: (data1[5] / BigInt(10 ** decimals)).toString(),
      projectBuildCost: (data1[6] / BigInt(10 ** decimals)).toString(),
      projectAnnualIncome: (data1[7] / BigInt(10 ** decimals)).toString(),
      projectInvestorShare: data1[8].toString(),
      projectInterestRate: data1[9].toString(),
      projectPremiumRate: data1[10].toString(),
      // From getProjectData2
      projectCurrentYear: data2[0].toString(),
      projectCumulativePrincipal: (data2[1] / BigInt(10 ** decimals)).toString(),
      projectRemainingPrincipal: (data2[2] / BigInt(10 ** decimals)).toString(),
      projectBuybackPrice: (data2[3] / BigInt(10 ** decimals)).toString(),
      projectBuybackActive: data2[4],
      projectPaymentToken: data2[5],
      projectFactory: data2[6],
    };

    return NextResponse.json({ ok: true, data: formattedData });
  } catch (error: any) {
    console.error('[Get Project Data] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

