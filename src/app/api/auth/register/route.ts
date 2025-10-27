import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function POST(request: NextRequest) {
  console.log('[register] API called');
  // 取得用戶輸入
  const body = await request.json();
  console.log('[register] body:', body);
  const {
    account,
    password,
    role,
    isKYC,
    web3Address,
  } = body;
  const registeredAt = new Date();
  const lastLogin = null;

  if (!account || !password) {
    console.log('[register] missing account or password');
    return NextResponse.json({ error: '帳號或密碼不可空' }, { status: 400 });
  }

  const client = new MongoClient(uri!);
  try {
    await client.connect();
    console.log('[register] connected to mongo');
    const db = client.db(dbName);
    const userCol = db.collection('user');

    // 檢查帳號是否已存在
    const existing = await userCol.findOne({ account });
    if (existing) {
      console.log('[register] account exists:', account);
      return NextResponse.json({ error: '帳號已存在' }, { status: 409 });
    }

    const user = {
      registeredAt,
      lastLogin,
      account,
      password, // 明文存密碼，只供測試
      role: role || 'user',
      isKYC: !!isKYC,
      web3Address: web3Address || '',
    };
    const result = await userCol.insertOne(user);
    console.log('[register] insert result:', result.insertedId);
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error('[register] error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  } finally {
    await client.close();
    console.log('[register] mongo closed');
  }
}
