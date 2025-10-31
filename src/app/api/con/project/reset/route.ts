import { NextRequest, NextResponse } from 'next/server';
import { walletClient } from '@/lib/blockchain';

// SafeHarvestNFT ABI
const PROJECT_ABI = [
  {
    inputs: [],
    name: 'resetNFTs',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/con/project/reset
 * Admin 重置 NFT（清空所有 NFT 並重新開始）
 * ⚠️ 危險操作：會銷毀所有現有 NFT
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

    // Call resetNFTs
    const hash = await walletClient.writeContract({
      address: projectAddress as `0x${string}`,
      abi: PROJECT_ABI,
      functionName: 'resetNFTs',
      args: [],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[Project Reset] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

