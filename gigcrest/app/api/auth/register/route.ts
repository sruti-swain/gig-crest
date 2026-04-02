// app/api/auth/register/route.ts
// POST /api/auth/register — Register a new worker
// Creates the worker + returns a JWT token

import { NextRequest, NextResponse } from 'next/server';
import { appendData, existsByField } from '@/lib/db';
import { generateId } from '@/lib/id-generator';
import { generateToken, hashPassword } from '@/lib/auth';
import { Worker, RegisterRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    const { name, phone, city, platform, vehicleType, primaryZoneId } = body;
    if (!name || !phone || !city || !platform || !vehicleType || !primaryZoneId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, phone, city, platform, vehicleType, primaryZoneId',
        },
        { status: 400 }
      );
    }

    // Validate phone format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Check duplicate phone
    if (existsByField<Worker>('workers.json', 'phone', phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const workerId = generateId('worker');

    const newWorker: Worker = {
      id: workerId,
      name,
      phone,
      email: undefined,
      city,
      platform,
      vehicleType,
      primaryZoneId,
      avgDailyEarnings: body.avgDailyEarnings || 750,
      avgWorkingHoursPerDay: 10,
      workingDaysPerWeek: 6,
      monthlyIncome: (body.avgDailyEarnings || 750) * 6 * 4,
      dependents: body.dependents || 0,
      education: body.education || '12th',
      language: body.language || 'Hindi',
      profileScore: 70,
      totalClaims: 0,
      totalPayouts: 0,
      joinedAt: now,
      isActive: true,
      passwordHash: hashPassword(phone), // use phone as default password
      createdAt: now,
      updatedAt: now,
    };

    appendData('workers.json', newWorker);

    // Generate JWT token
    const token = await generateToken({
      workerId,
      phone,
      role: 'worker',
    });

    // Return worker without password hash
    const { ...safeWorker } = newWorker;

    return NextResponse.json(
      {
        success: true,
        data: {
          worker: safeWorker,
          token,
        },
        message: 'Registration successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}