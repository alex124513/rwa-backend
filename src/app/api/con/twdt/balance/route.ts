import { NextRequest, NextResponse } from 'next/server';
import { publicClient, TWDT_ADDRESS } from '@/lib/blockchain';

// TWDT ABI
const TWDT_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * GET /api/con/twdt/balance?address=0x...
 * 查詢 TWDT 餘額
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
    }

    const balance = await publicClient.readContract({
      address: TWDT_ADDRESS,
      abi: TWDT_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });

    // Convert from wei (6 decimals) to human readable
    const balanceFormatted = balance / BigInt(10 ** 6);

    return NextResponse.json({ ok: true, balance: balance.toString(), balanceFormatted: balanceFormatted.toString() });
  } catch (error: any) {
    console.error('[TWDT Balance] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

