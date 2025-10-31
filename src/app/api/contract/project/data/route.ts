import { NextRequest, NextResponse } from 'next/server';
import { publicClient } from '@/lib/blockchain';

// SafeHarvestNFT ABI
const PROJECT_ABI = [
  {
    inputs: [],
    name: 'getProjectData',
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

    const data = await publicClient.readContract({
      address: projectAddress as `0x${string}`,
      abi: PROJECT_ABI,
      functionName: 'getProjectData',
      args: [],
    });

    // Format response with human readable values (6 decimals)
    const decimals = 6;
    const formattedData = {
      currentStatus: data[0],
      projectOwner: data[1],
      projectFarmer: data[2],
      nftTotalSupply: data[3].toString(),
      nftMintedCount: data[4].toString(),
      nftPricePerUnit: (data[5] / BigInt(10 ** decimals)).toString(),
      projectBuildCost: (data[6] / BigInt(10 ** decimals)).toString(),
      projectAnnualIncome: (data[7] / BigInt(10 ** decimals)).toString(),
      projectInvestorShare: data[8].toString(),
      projectInterestRate: data[9].toString(),
      projectPremiumRate: data[10].toString(),
      projectCurrentYear: data[11].toString(),
      projectCumulativePrincipal: (data[12] / BigInt(10 ** decimals)).toString(),
      projectRemainingPrincipal: (data[13] / BigInt(10 ** decimals)).toString(),
      projectBuybackPrice: (data[14] / BigInt(10 ** decimals)).toString(),
      projectBuybackActive: data[15],
      projectPaymentToken: data[16],
      projectFactory: data[17],
    };

    return NextResponse.json({ ok: true, data: formattedData });
  } catch (error: any) {
    console.error('[Get Project Data] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

