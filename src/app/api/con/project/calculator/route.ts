import { NextRequest, NextResponse } from 'next/server';
import { walletClient } from '@/lib/blockchain';

// SafeHarvestNFT ABI
const PROJECT_ABI = [
  {
    inputs: [],
    name: 'SafeHarvestCalculator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/con/project/calculator
 * Admin 觸發年度結算 (SafeHarvestCalculator)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectAddress } = body;

    if (!projectAddress) {
      return NextResponse.json(
        { error: 'Missing required field: projectAddress' },
        { status: 400 }
      );
    }

    // Call SafeHarvestCalculator
    const hash = await walletClient.writeContract({
      address: projectAddress as `0x${string}`,
      abi: PROJECT_ABI,
      functionName: 'SafeHarvestCalculator',
      args: [],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[Project Calculator] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

