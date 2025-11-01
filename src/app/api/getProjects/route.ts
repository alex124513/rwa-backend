import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function GET(request: NextRequest) {
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
      // 直接原封回傳所有 field
      return NextResponse.json({ ok: true, projects: docs });
    } finally {
      try { await client.close(); } catch {}
    }
  } catch (e) {
    console.error('[getProjects] error:', e);
    return NextResponse.json({ ok: true, projects: [] });
  }
}
