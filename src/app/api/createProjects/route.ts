import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, farmer_id, status_on_chain, contract_address } = body;
    if (!title || !farmer_id || !status_on_chain || !contract_address) {
      return NextResponse.json({ error: '必要欄位未填' }, { status: 400 });
    }
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');
    const result = await collection.insertOne({
      title,
      farmer_id,
      status_on_chain,
      contract_address,
    });
    await client.close();
    return NextResponse.json({ ok: true, projectId: result.insertedId });
  } catch (e) {
    console.error('[createProjects] error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
