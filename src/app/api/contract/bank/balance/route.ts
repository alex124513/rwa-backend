import { NextRequest, NextResponse } from 'next/server';
import { publicClient, BANK_FACTORY_ADDRESS } from '@/lib/blockchain';

// BankFactory ABI
const BANK_FACTORY_ABI = [
  {
    inputs: [],
    name: 'getFactoryBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * GET /api/contract/bank/balance
 * 查詢工廠 TWDT 餘額
 */
export async function GET(request: NextRequest) {
  try {
    const balance = await publicClient.readContract({
      address: BANK_FACTORY_ADDRESS,
      abi: BANK_FACTORY_ABI,
      functionName: 'getFactoryBalance',
      args: [],
    });

    // Convert from wei (6 decimals) to human readable
    const balanceFormatted = balance / BigInt(10 ** 6);

    return NextResponse.json({ ok: true, balance: balance.toString(), balanceFormatted: balanceFormatted.toString() });
  } catch (error: any) {
    console.error('[Factory Balance] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

