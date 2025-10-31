import { NextRequest, NextResponse } from 'next/server';
import { walletClient, BANK_FACTORY_ADDRESS } from '@/lib/blockchain';

// BankFactory ABI
const BANK_FACTORY_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'depositFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/contract/bank/deposit
 * Admin 存入資金到工廠
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Missing required field: amount' }, { status: 400 });
    }

    // Convert amount to wei (6 decimals)
    const amountWei = BigInt(amount) * BigInt(10 ** 6);

    // Call depositFunds
    const hash = await walletClient.writeContract({
      address: BANK_FACTORY_ADDRESS,
      abi: BANK_FACTORY_ABI,
      functionName: 'depositFunds',
      args: [amountWei],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[Bank Deposit] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

