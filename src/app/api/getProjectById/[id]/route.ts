import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

/**
 * GET /api/getProjectById/:id
 * 根據 ID 查詢單一專案完整資料
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!uri || !dbName) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    // 驗證 ObjectId 格式（24 位十六進制字串）
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ObjectId format' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('projects');

      // 查詢專案
      const project = await collection.findOne({ _id: new ObjectId(id) });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // 映射成前端格式（保留完整資料）
      const expectedRoiStr: string = project.annual_yield_rate || '';
      const expectedROI = (() => {
        const m = String(expectedRoiStr).match(/([\d.]+)/);
        return m ? Number(m[1]) : 0;
      })();
      const insuranceProvider: string | undefined = project.insurance_company || undefined;

      const formattedProject = {
        id: String(project._id),
        name: project.title ?? '',
        location: project.region ?? '',
        cropType: project.crop_name ?? '',
        image: project.imageURL ?? '',
        expectedROI,
        tokenizedShare: project.tokenized_share ?? '',
        status: project.status ?? '',
        contractAddress: project.contract_address ?? '',
        insuranceCoverage: Boolean(insuranceProvider),
        insuranceProvider,
        // 額外完整欄位
        description: project.description ?? '',
        area: project.area ?? 0,
        startDate: project.start_date ?? '',
        endDate: project.end_date ?? '',
        expectedYield: project.expected_yield ?? 0,
        unitPrice: project.unit_price ?? 0,
        hasInsurance: project.has_insurance ?? false,
        sustainability: project.sustainability ?? '',
        buildCost: project.build_cost ?? 0,
        annualIncome: project.annual_income ?? 0,
        investorShare: project.investor_share ?? 0,
        interestRate: project.interest_rate ?? 0,
        premiumRate: project.premium_rate ?? 0,
        adminAgree: project.admin_agree ?? false,
        statusOnChain: project.status_on_chain ?? '',
        fundingStatus: project.funding_status ?? '',
        statusDisplay: project.status_display ?? '',
        totalNft: project.total_nft ?? 0,
        nftPrice: project.nft_price ?? 0,
        fundedAmount: project.funded_amount ?? 0,
        fundedNft: project.funded_nft ?? 0,
        mintedNft: project.minted_nft ?? 0,
        targetAmount: project.target_amount ?? 0,
        farmerId: project.farmer_id ?? '',
        farmerAddress: project.farmer_address ?? '',
        factoryAddress: project.factory_address ?? '',
        paymentTokenAddress: project.payment_token_address ?? '',
        deploymentTxHash: project.deployment_tx_hash ?? '',
        createdAt: project.created_at ?? null,
        updatedAt: project.updated_at ?? null,
        deployedAt: project.deployed_at ?? null,
      };

      return NextResponse.json(formattedProject);
    } finally {
      try { await client.close(); } catch {}
    }
  } catch (error: any) {
    console.error('[GET /api/getProjectById/:id] error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

