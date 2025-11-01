import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 全自動保留所有 client input 欄位
    const inputData = { ...body };
    // 強制 cover_image overwrite
    inputData.cover_image = 'https://plus.unsplash.com/premium_photo-1661823013705-d58ac4788630?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740';

    // 不做任何欄位驗證
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');
    const result = await collection.insertOne(inputData);
    await client.close();
    return NextResponse.json({ ok: true, projectId: result.insertedId });
  } catch (e) {
    console.error('[createProjects] error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
