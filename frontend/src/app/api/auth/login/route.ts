import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyPassword, createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, password } = body;
    const { remember } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    email = email.trim();
    password = password.trim();

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const admin = await db.collection('admins').findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: 'admin'
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24 // 7 days or 24 hours
    });

    return NextResponse.json({ 
      user: { email: admin.email, name: admin.name, role: 'admin' } 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
