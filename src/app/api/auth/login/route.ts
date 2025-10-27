import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { account, password } = body;
  if (!account || !password) {
    return NextResponse.json({ error: '帳號或密碼不可空' }, { status: 400 });
  }

  const client = new MongoClient(uri!);
  try {
    await client.connect();
    const db = client.db(dbName);
    const userCol = db.collection('user');
    const user = await userCol.findOne({ account, password });
    if (!user) {
      return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 });
    }
    // 更新最後登入時間
    await userCol.updateOne({ account }, { $set: { lastLogin: new Date() } });
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
