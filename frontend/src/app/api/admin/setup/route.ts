import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    
    // Check if any admin exists
    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount > 0) {
      return NextResponse.json({ message: 'Admin already setup' }, { status: 400 });
    }

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection('admins').insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'admin',
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'Admin created successfully', id: result.insertedId });
  } catch (error: any) {
    console.error('Setup error details:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
