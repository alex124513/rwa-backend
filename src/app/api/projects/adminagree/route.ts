import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { publicClient, BANK_FACTORY_ADDRESS } from '@/lib/blockchain';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

/**
 * POST /api/projects/adminagree
 * Body: { _id: string } // Mongo ObjectId string
 * 將指定專案的 admin_agree 設為 true
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id } = body || {};

    if (!_id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    }

    console.log('[adminagree] received _id:', _id);

    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { admin_agree: true, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      await client.close();
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 先取出專案確認存在，等會傳給部署 API 用
    const project = await db.collection('projects').findOne({ _id: new ObjectId(_id) });
    console.log('[adminagree] set admin_agree = true');
    console.log('[adminagree] project doc:', JSON.stringify(project, null, 2));
    await client.close();

    // 讀取部署前的 all projects
    const FACTORY_READ_ABI = [
      {
        inputs: [],
        name: 'getAllProjects',
        outputs: [{ name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const;

    let preAll: readonly `0x${string}`[] = [];
    try {
      preAll = await publicClient.readContract({
        address: BANK_FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_READ_ABI,
        functionName: 'getAllProjects',
        args: [],
      });
      console.log('[adminagree] pre-allProjects count:', preAll.length);
    } catch (e) {
      console.log('[adminagree] pre-allProjects failed:', String(e));
    }

    // 自動呼叫部署 API（以相同 origin）
    let deploy: any = null;
    try {
      const baseUrl = request.nextUrl.origin;
      const resp = await fetch(`${baseUrl}/api/contract/bank/deployFromDb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: _id }),
      });
      const json = await resp.json();
      deploy = { status: resp.status, ...json };
    } catch (e: any) {
      deploy = { status: 500, error: 'deployFromDb call failed', detail: String(e) };
    }

    // 讀取部署後的 all projects 並找出新增的地址
    let detectedAddress: string | undefined = undefined;
    try {
      const postAll = await publicClient.readContract({
        address: BANK_FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_READ_ABI,
        functionName: 'getAllProjects',
        args: [],
      });
      console.log('[adminagree] post-allProjects count:', postAll.length);
      if (preAll && Array.isArray(preAll) && Array.isArray(postAll)) {
        const preSet = new Set(preAll.map((a) => a.toLowerCase()));
        const diff = postAll.filter((a: string) => !preSet.has(a.toLowerCase()));
        if (diff.length > 0) detectedAddress = diff[diff.length - 1];
      }
    } catch (e) {
      console.log('[adminagree] post-allProjects failed:', String(e));
    }

    // 後備：用部署 API 回傳或最後一個元素
    if (!detectedAddress) {
      detectedAddress = deploy?.contractAddress || deploy?.contract_address;
    }

    return NextResponse.json({
      ok: true,
      updated: result.modifiedCount === 1,
      projectId: _id,
      contractAddress: detectedAddress || '',
      deploy,
    });
  } catch (error: any) {
    console.error('[AdminAgree] error:', error);
    return NextResponse.json({ error: error.message || 'server error' }, { status: 500 });
  }
}


