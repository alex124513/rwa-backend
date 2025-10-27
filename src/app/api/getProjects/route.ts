import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function GET(request: NextRequest) {
  try {
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');
    const projects = await collection.find().toArray();
    await client.close();
    return NextResponse.json({ ok: true, projects });
  } catch (e) {
    console.error('[getProjects] error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
