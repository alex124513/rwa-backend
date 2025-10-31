import { NextRequest, NextResponse } from 'next/server';
import { walletClient } from '@/lib/blockchain';

// SafeHarvestNFT ABI
const PROJECT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/con/project/withdraw
 * Admin 提領專案資金
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectAddress, to, amount } = body;

    if (!projectAddress || !to || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: projectAddress, to, amount' },
        { status: 400 }
      );
    }

    // Convert amount to wei (6 decimals)
    const amountWei = BigInt(amount) * BigInt(10 ** 6);

    // Call withdrawFunds
    const hash = await walletClient.writeContract({
      address: projectAddress as `0x${string}`,
      abi: PROJECT_ABI,
      functionName: 'withdrawFunds',
      args: [to as `0x${string}`, amountWei],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[Project Withdraw] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

