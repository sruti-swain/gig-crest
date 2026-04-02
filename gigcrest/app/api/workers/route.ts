// app/api/workers/route.ts
// GET  /api/workers — List all workers (with optional filters)
// POST /api/workers — Create a new worker

import { NextRequest, NextResponse } from 'next/server';
import { readData, appendData, existsByField } from '@/lib/db';
import { generateId } from '@/lib/id-generator';
import { Worker, ApiResponse } from '@/types';

// GET — List all workers with optional filters
export async function GET(request: NextRequest) {
  try {
    const workers = readData<Worker>('workers.json');

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const zoneId = searchParams.get('zoneId');
    const platform = searchParams.get('platform');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search'); // search by name or phone

    let filtered = workers;

    if (city) {
      filtered = filtered.filter(
        (w) => w.city.toLowerCase() === city.toLowerCase()
      );
    }
    if (zoneId) {
      filtered = filtered.filter((w) => w.primaryZoneId === zoneId);
    }
    if (platform) {
      filtered = filtered.filter((w) => w.platform === platform);
    }
    if (isActive !== null && isActive !== undefined) {
      filtered = filtered.filter((w) => w.isActive === (isActive === 'true'));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.phone.includes(q)
      );
    }

    // Don't expose password hashes in list view
    const safe = filtered.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json({
      success: true,
      data: {
        workers: safe,
        total: safe.length,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('GET /api/workers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workers' },
      { status: 500 }
    );
  }
}

// POST — Create a new worker
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
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

    // Check for duplicate phone number
    if (existsByField<Worker>('workers.json', 'phone', phone)) {
      return NextResponse.json(
        { success: false, error: 'A worker with this phone number already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const newWorker: Worker = {
      id: generateId('worker'),
      name,
      phone,
      email: body.email || undefined,
      city,
      platform,
      vehicleType,
      primaryZoneId,
      avgDailyEarnings: body.avgDailyEarnings || 750,
      avgWorkingHoursPerDay: body.avgWorkingHoursPerDay || 10,
      workingDaysPerWeek: body.workingDaysPerWeek || 6,
      monthlyIncome: body.monthlyIncome || (body.avgDailyEarnings || 750) * 6 * 4,
      dependents: body.dependents || 0,
      education: body.education || '12th',
      language: body.language || 'Hindi',
      profileScore: 70, // new workers start at 70
      totalClaims: 0,
      totalPayouts: 0,
      joinedAt: now,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    appendData('workers.json', newWorker);

    // Remove passwordHash before returning
    const { passwordHash, ...safeWorker } = newWorker;

    return NextResponse.json(
      {
        success: true,
        data: { worker: safeWorker },
        message: 'Worker created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/workers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create worker' },
      { status: 500 }
    );
  }
}