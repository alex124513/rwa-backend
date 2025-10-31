import { NextRequest, NextResponse } from 'next/server';
import { walletClient, BANK_FACTORY_ADDRESS } from '@/lib/blockchain';

// BankFactory ABI
const BANK_FACTORY_ABI = [
  {
    inputs: [
      { name: 'name_', type: 'string' },
      { name: 'symbol_', type: 'string' },
      { name: 'farmer_', type: 'address' },
      { name: 'totalNFTs', type: 'uint256' },
      { name: 'nftPrice', type: 'uint256' },
      { name: 'buildCost', type: 'uint256' },
      { name: 'annualIncome', type: 'uint256' },
      { name: 'investorShare', type: 'uint256' },
      { name: 'interestRate', type: 'uint256' },
      { name: 'premiumRate', type: 'uint256' },
    ],
    name: 'createProject',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * POST /api/con/bank/createProject
 * Admin 建立新專案
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name,           // string
      symbol,         // string
      farmer,         // address
      totalNFTs,      // number
      nftPrice,       // number (human readable)
      buildCost,      // number (human readable)
      annualIncome,   // number (human readable)
      investorShare,  // number (percentage)
      interestRate,   // number (percentage)
      premiumRate,    // number (percentage)
    } = body;

    // Validate required fields
    if (!name || !symbol || !farmer || !totalNFTs || !nftPrice || 
        !buildCost || !annualIncome || !investorShare || !interestRate || !premiumRate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert human readable amounts to wei (6 decimals)
    const nftPriceWei = BigInt(nftPrice) * BigInt(10 ** 6);
    const buildCostWei = BigInt(buildCost) * BigInt(10 ** 6);
    const annualIncomeWei = BigInt(annualIncome) * BigInt(10 ** 6);

    // Call createProject
    const hash = await walletClient.writeContract({
      address: BANK_FACTORY_ADDRESS,
      abi: BANK_FACTORY_ABI,
      functionName: 'createProject',
      args: [
        name,
        symbol,
        farmer as `0x${string}`,
        BigInt(totalNFTs),
        nftPriceWei,
        buildCostWei,
        annualIncomeWei,
        BigInt(investorShare),
        BigInt(interestRate),
        BigInt(premiumRate),
      ],
    });

    return NextResponse.json({ ok: true, txHash: hash });
  } catch (error: any) {
    console.error('[Create Project] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

