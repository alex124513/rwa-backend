import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { walletClient, publicClient, BANK_FACTORY_ADDRESS, TWDT_ADDRESS } from '@/lib/blockchain';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// BankFactory ABI（最小必要）
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body || {};

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    console.log('[deployFromDb] received projectId:', projectId);

    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    const project = await collection.findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      await client.close();
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 驗證必要欄位 + 顯示映射
    const required = [
      'title',
      'symbol',
      'farmer_address',
      'total_nft',
      'nft_price',
      'build_cost',
      'annual_income',
      'investor_share',
      'interest_rate',
      'premium_rate',
    ];
    const issues: string[] = [];
    for (const key of required) {
      if (project[key] === undefined || project[key] === null || project[key] === '') {
        issues.push(`Missing field in DB: ${key}`);
      }
    }

    // 額外格式檢查
    const isHexAddress = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);
    if (project.farmer_address && !isHexAddress(project.farmer_address)) {
      issues.push('Invalid farmer_address (expect 0x + 40 hex)');
    }
    const mustBeInt = ['total_nft', 'nft_price', 'build_cost', 'annual_income'];
    for (const k of mustBeInt) {
      if (project[k] !== undefined) {
        if (typeof project[k] !== 'number' || !Number.isFinite(project[k])) {
          issues.push(`Field ${k} must be a finite number`);
        } else if (!Number.isInteger(project[k])) {
          issues.push(`Field ${k} must be an integer (no decimals)`);
        }
      }
    }
    const mustBeNumber = ['investor_share', 'interest_rate', 'premium_rate'];
    for (const k of mustBeNumber) {
      if (project[k] !== undefined && (typeof project[k] !== 'number' || !Number.isFinite(project[k]))) {
        issues.push(`Field ${k} must be a finite number`);
      }
    }

    // 映射列印（先於上鏈前輸出對應）
    const mappingPreview = [
      { db: 'title', value: project.title, contract: 'name' },
      { db: 'symbol', value: project.symbol, contract: 'symbol' },
      { db: 'farmer_address', value: project.farmer_address, contract: 'farmer' },
      { db: 'total_nft', value: project.total_nft, contract: 'totalNFTs' },
      { db: 'nft_price', value: project.nft_price, contract: 'nftPrice(6decimals)' },
      { db: 'build_cost', value: project.build_cost, contract: 'buildCost(6decimals)' },
      { db: 'annual_income', value: project.annual_income, contract: 'annualIncome(6decimals)' },
      { db: 'investor_share', value: project.investor_share, contract: 'investorShare' },
      { db: 'interest_rate', value: project.interest_rate, contract: 'interestRate' },
      { db: 'premium_rate', value: project.premium_rate, contract: 'premiumRate' },
    ];
    for (const m of mappingPreview) {
      console.log(`[deployFromDb] map: DB.${m.db}="${m.value}" -> contract.${m.contract}`);
    }

    if (issues.length > 0) {
      console.log('[deployFromDb] preflight failed:', issues);
      await client.close();
      return NextResponse.json({ ok: false, preflightOnly: true, issues }, { status: 400 });
    }

    // 數值轉換（以 6 位小數）
    const nftPriceWei = BigInt(project.nft_price) * BigInt(10 ** 6);
    const buildCostWei = BigInt(project.build_cost) * BigInt(10 ** 6);
    const annualIncomeWei = BigInt(project.annual_income) * BigInt(10 ** 6);

    console.log('[deployFromDb] createProject args:', {
      name: project.title,
      symbol: project.symbol,
      farmer: project.farmer_address,
      totalNFTs: String(project.total_nft),
      nftPriceWei: String(nftPriceWei),
      buildCostWei: String(buildCostWei),
      annualIncomeWei: String(annualIncomeWei),
      investorShare: String(project.investor_share),
      interestRate: String(project.interest_rate),
      premiumRate: String(project.premium_rate),
      factory: BANK_FACTORY_ADDRESS,
    });

    // 寫入鏈上合約
    const txHash = await walletClient.writeContract({
      address: BANK_FACTORY_ADDRESS as `0x${string}`,
      abi: BANK_FACTORY_ABI,
      functionName: 'createProject',
      args: [
        project.title,
        project.symbol,
        project.farmer_address as `0x${string}`,
        BigInt(project.total_nft),
        nftPriceWei,
        buildCostWei,
        annualIncomeWei,
        BigInt(project.investor_share),
        BigInt(project.interest_rate),
        BigInt(project.premium_rate),
      ],
    });

    // 等待交易完成
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    // 讀取最新專案地址
    const factoryAbi2 = [
      {
        inputs: [],
        name: 'getAllProjects',
        outputs: [{ name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const;
    const allProjects = await publicClient.readContract({
      address: BANK_FACTORY_ADDRESS as `0x${string}`,
      abi: factoryAbi2,
      functionName: 'getAllProjects',
      args: [],
    });
    const contractAddress = allProjects[allProjects.length - 1];

    console.log('[deployFromDb] success. NFT address:', contractAddress);

    // 更新 DB 狀態與鏈上資料
    await collection.updateOne(
      { _id: new ObjectId(projectId) },
      {
        $set: {
          admin_agree: true,
          status_on_chain: 'ACTIVE',
          funding_status: 'OPENING',
          status_display: '開放中',
          contract_address: contractAddress,
          factory_address: BANK_FACTORY_ADDRESS,
          payment_token_address: TWDT_ADDRESS || '',
          deployment_tx_hash: txHash,
          deployed_at: new Date(),
          updated_at: new Date(),
        },
      }
    );

    await client.close();

    return NextResponse.json({ ok: true, txHash, contractAddress });
  } catch (error: any) {
    console.error('[deployFromDb] error:', error);
    return NextResponse.json({ error: error.message || 'server error' }, { status: 500 });
  }
}


