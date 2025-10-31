import { NextRequest, NextResponse } from 'next/server';
import { walletClient, TWDT_ADDRESS } from '@/lib/blockchain';

// TWDT ABI
const TWDT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/con/twdt/mint
 * Admin 鑄造 TWDT 代幣
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, amount } = body;

    if (!to || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: to, amount' },
        { status: 400 }
      );
    }

    // Convert amount to wei (6 decimals)
    const amountWei = BigInt(amount) * BigInt(10 ** 6);

    // Call mint function
    const hash = await walletClient.writeContract({
      address: TWDT_ADDRESS,
      abi: TWDT_ABI,
      functionName: 'mint',
      args: [to, amountWei],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[TWDT Mint] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

