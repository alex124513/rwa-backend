import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

interface ProjectSubmission {
  // 基本資訊
  projectName: string;
  cropType: string;
  location: string;
  area: number;
  description: string;
  startDate: string;
  endDate: string;
  expectedYield: number;
  unitPrice: number;
  hasInsurance: boolean;
  sustainability?: string;
  coverImage: string;
  
  // 投資假設參數
  initCost: number;           // 溫室建構費（萬）
  annualIncome: number;       // 每年營業額（萬）
  investorPercent: number;    // 投資人收益分成%
  interest: number;           // 利率%
  premium: number;            // 溢酬%
  
  // 其他資訊
  farmer_id?: string;
  insuranceCompany?: string;
}

function genSymbol() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let symbol = '';
  for(let i=0; i<3; i++) symbol += chars[Math.floor(Math.random()*26)];
  return symbol;
}

/**
 * POST /api/projects/submit
 * 農夫提交新專案進行審核
 * 所有資料存入 DB，狀態為 adminAgree: false（等待審核）
 */
export async function POST(request: NextRequest) {
  try {
    const body: ProjectSubmission = await request.json();

    // 驗證必填欄位
    if (!body.projectName || !body.cropType || !body.location || 
        !body.description || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 連線 MongoDB
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    // 準備插入資料
    const projectData = {
      // 基本資訊
      title: body.projectName,
      symbol: genSymbol(), // 自動產生三位英文符號
      description: body.description,
      crop_name: body.cropType,  // 使用 cropType 作為 crop_name
      crop_type: body.cropType,
      location: body.location,
      area: body.area || 0,
      
      // 時間資訊
      start_date: body.startDate,
      end_date: body.endDate,
      
      // 產量與價格
      expected_yield: body.expectedYield || 0,
      unit_price: body.unitPrice || 0,
      
      // 保險資訊
      has_insurance: body.hasInsurance || false,
      insurance_company: body.insuranceCompany || '',
      
      // 永續性說明
      sustainability: body.sustainability || '',
      
      // 封面圖片
      cover_image: body.coverImage || '',
      
      // 投資假設參數
      build_cost: body.initCost || 0,                    // 建造成本（萬）
      annual_income: body.annualIncome || 0,            // 年度收益（萬）
      investor_share: body.investorPercent || 0,        // 投資人分潤%
      interest_rate: body.interest || 0,                // 利率%
      premium_rate: body.premium || 0,                  // 溢酬%
      
      // 狀態資訊
      admin_agree: false,                               // 等待審核
      status_on_chain: 'PENDING',                       // 鏈上狀態：待部署
      funding_status: 'COMING_SOON',                    // 募資狀態：即將推出
      status_display: '審核中',                          // 前端顯示
      
      // 預設數值
      total_nft: 0,                                     // 待審核後設定
      nft_price: 0,                                     // 待審核後設定
      funded_amount: 0,
      funded_nft: 0,
      minted_nft: 0,
      target_amount: 0,
      
      // 農夫資訊
      farmer_id: body.farmer_id || 'farmer001',         // 預設值
      
      // 鏈上資訊（待部署後填入）
      contract_address: '',
      factory_address: '',
      payment_token_address: '',
      
      // 時間戳記
      created_at: new Date(),
      updated_at: new Date(),
      deployed_at: null,
    };

    // 插入資料
    const result = await collection.insertOne(projectData);
    
    await client.close();

    return NextResponse.json({ 
      ok: true, 
      projectId: result.insertedId,
      message: '專案已提交，等待審核'
    });
  } catch (error: any) {
    console.error('[Submit Project] error:', error);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

