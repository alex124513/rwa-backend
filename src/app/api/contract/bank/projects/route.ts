import { NextRequest, NextResponse } from 'next/server';
import { publicClient, BANK_FACTORY_ADDRESS } from '@/lib/blockchain';

// BankFactory ABI
const BANK_FACTORY_ABI = [
  {
    inputs: [],
    name: 'getAllProjects',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * GET /api/contract/bank/projects
 * 取得所有專案清單
 */
export async function GET(request: NextRequest) {
  try {
    const projects = await publicClient.readContract({
      address: BANK_FACTORY_ADDRESS,
      abi: BANK_FACTORY_ABI,
      functionName: 'getAllProjects',
      args: [],
    });

    return NextResponse.json({ ok: true, projects });
  } catch (error: any) {
    console.error('[Get All Projects] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

