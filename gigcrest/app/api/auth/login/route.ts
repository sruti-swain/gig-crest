// app/api/auth/login/route.ts
// POST /api/auth/login — Login with phone + mock OTP
// Mock OTP is always "1234" for demo purposes

import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import { generateToken, verifyOtp } from '@/lib/auth';
import { Worker, LoginRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    const { phone, otp } = body;

    // Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    // Check for admin login (hardcoded demo admin)
    if (phone === 'admin' && otp === '1234') {
      const token = await generateToken({
        workerId: 'admin_001',
        phone: 'admin',
        role: 'admin',
      });

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: 'admin_001',
            name: 'Admin',
            phone: 'admin',
            role: 'admin',
          },
          token,
        },
        message: 'Admin login successful',
      });
    }

    // Verify OTP (mock — always "1234")
    if (!verifyOtp(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Use 1234 for demo.' },
        { status: 401 }
      );
    }

    // Find worker by phone
    const workers = readData<Worker>('workers.json');
    const worker = workers.find((w) => w.phone === phone);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: 'No account found with this phone number' },
        { status: 404 }
      );
    }

    if (!worker.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated. Contact support.' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      workerId: worker.id,
      phone: worker.phone,
      role: 'worker',
    });

    // Return worker without password hash
    const { ...safeWorker } = worker;

    return NextResponse.json({
      success: true,
      data: {
        worker: safeWorker,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}