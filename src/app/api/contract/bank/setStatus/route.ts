import { NextRequest, NextResponse } from 'next/server';
import { walletClient, BANK_FACTORY_ADDRESS } from '@/lib/blockchain';

// BankFactory ABI
const BANK_FACTORY_ABI = [
  {
    inputs: [
      { name: 'project', type: 'address' },
      { name: 'newStatus', type: 'uint8' },
    ],
    name: 'setProjectStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/contract/bank/setStatus
 * Admin 設定專案狀態 (1=正常, 2=僅提領, 3=全面停止)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, status } = body;

    if (!project || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: project, status' },
        { status: 400 }
      );
    }

    if (status < 1 || status > 3) {
      return NextResponse.json(
        { error: 'Status must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    // Call setProjectStatus
    const hash = await walletClient.writeContract({
      address: BANK_FACTORY_ADDRESS as `0x${string}`,
      abi: BANK_FACTORY_ABI,
      functionName: 'setProjectStatus',
      args: [project as `0x${string}`, status],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[Set Project Status] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

