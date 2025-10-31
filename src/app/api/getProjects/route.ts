import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function GET(request: NextRequest) {
  // 無 DB 設定時回傳空列表（方便本地／前端測試）
  if (!uri || !dbName) {
    return NextResponse.json({ ok: true, projects: [] });
  }
  try {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('projects');
      const docs = await collection.find().toArray();

      const projects = docs.map((p: any) => {
        const expectedRoiStr: string = p.annual_yield_rate || '';
        const expectedROI = (() => {
          const m = String(expectedRoiStr).match(/([\d.]+)/);
          return m ? Number(m[1]) : 0;
        })();
        const insuranceProvider: string | undefined = p.insurance_company || undefined;
        return {
          id: String(p._id ?? ''),
          name: p.title ?? '',
          location: p.region ?? '',
          cropType: p.crop_name ?? '',
          image: p.imageURL ?? '',
          expectedROI,
          tokenizedShare: p.tokenized_share ?? '',
          status: p.status ?? '',
          contractAddress: p.contract_address ?? '',
          insuranceCoverage: Boolean(insuranceProvider),
          insuranceProvider,
        };
      });

      return NextResponse.json({ ok: true, projects });
    } finally {
      try { await client.close(); } catch {}
    }
  } catch (e) {
    console.error('[getProjects] error:', e);
    // 連線失敗時回傳空陣列，保持前端可用
    return NextResponse.json({ ok: true, projects: [] });
  }
}
