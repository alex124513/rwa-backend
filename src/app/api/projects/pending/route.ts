import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

/**
 * GET /api/projects/pending
 * 查詢所有待審核專案 (admin_agree: false)
 */
export async function GET(request: NextRequest) {
  try {
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    const projects = await collection
      .find({ admin_agree: false })
      .sort({ created_at: -1 })
      .toArray();

    await client.close();

    return NextResponse.json({ ok: true, projects });
  } catch (error: any) {
    console.error('[Get Pending Projects] error:', error);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

