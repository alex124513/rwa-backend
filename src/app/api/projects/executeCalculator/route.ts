import { NextRequest, NextResponse } from 'next/server';
import { walletClient, publicClient } from '@/lib/blockchain';

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
 * POST /api/projects/executeCalculator
 * 執行指定合約地址的 SafeHarvestCalculator()
 * Request body: { contract_address: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contract_address } = body;

    if (!contract_address) {
      return NextResponse.json(
        { error: 'Missing contract_address' },
        { status: 400 }
      );
    }

    // 驗證地址格式（0x開頭的42字元）
    if (!/^0x[a-fA-F0-9]{40}$/.test(contract_address)) {
      return NextResponse.json(
        { error: 'Invalid contract address format' },
        { status: 400 }
      );
    }

    // 執行 SafeHarvestCalculator
    const hash = await walletClient.writeContract({
      address: contract_address as `0x${string}`,
      abi: PROJECT_ABI,
      functionName: 'SafeHarvestCalculator',
      args: [],
    });

    // 等待交易確認
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({
      ok: true,
      contract_address,
      txHash: hash,
      status: receipt.status,
      blockNumber: receipt.blockNumber.toString(),
      message: 'SafeHarvestCalculator executed successfully',
    });
  } catch (error: any) {
    console.error('[Execute Calculator] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

