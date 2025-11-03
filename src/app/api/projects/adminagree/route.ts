import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { admin_agree: true, updated_at: new Date() } }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, updated: result.modifiedCount === 1 });
  } catch (error: any) {
    console.error('[AdminAgree] error:', error);
    return NextResponse.json({ error: error.message || 'server error' }, { status: 500 });
  }
}


