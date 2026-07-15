import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword, getSession, type Session } from '@/lib/auth';
import { sendAdminWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await getSession() as Session | null;
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let { email, password } = body;
    const { name } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    email = email.trim();
    password = password.trim();

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    
    const hashedPassword = await hashPassword(password);
    
    // Check if an admin with this email already exists
    const existingAdmin = await db.collection('admins').findOne({ email: email.toLowerCase() });
    
    if (existingAdmin) {
      // Update password and name
      await db.collection('admins').updateOne(
        { email: email.toLowerCase() },
        { $set: { password: hashedPassword, name: name || existingAdmin.name } }
      );
      
      await sendAdminWelcomeEmail(email, name || existingAdmin.name, password);
      
      return NextResponse.json({ message: 'Login credentials updated successfully' });
    } else {
      // Insert new admin
      await db.collection('admins').insertOne({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || 'Admin',
        role: 'admin',
        createdAt: new Date()
      });
      
      await sendAdminWelcomeEmail(email, name || 'Admin', password);
      
      return NextResponse.json({ message: 'New admin login created successfully' });
    }

  } catch (error) {
    console.error('Manage login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession() as Session | null;
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    
    // Fetch all admins but exclude the password field
    const admins = await db.collection('admins').find({}, { projection: { password: 0 } }).toArray();
    
    return NextResponse.json(admins);
  } catch (error) {
    console.error('Fetch admins error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession() as Session | null;
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    if (email.toLowerCase() === session.email.toLowerCase()) {
      return NextResponse.json({ message: 'Cannot delete your own active account' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    
    const result = await db.collection('admins').deleteOne({ email: email.toLowerCase() });
    
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Admin removed successfully' });
    } else {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

