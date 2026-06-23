export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { readData, appendData, existsByField } from '@/lib/db';
import { generateId } from '@/lib/id-generator';
import type { Worker, ApiResponse } from '@/types';

// GET — List workers
export async function GET(request: NextRequest) {
  try {
    const workers =await readData<Worker>('workers.json');

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const zoneId = searchParams.get('zoneId');
    const platform = searchParams.get('platform');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

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
      filtered = filtered.filter(
        (w) => w.deliveryPlatform === platform
      );
    }

    if (isActive !== null && isActive !== undefined) {
      filtered = filtered.filter(
        (w) => w.isActive === (isActive === 'true')
      );
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.phone.includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        workers: filtered,
        total: filtered.length,
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

// POST — Create worker
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      city,
      deliveryPlatform,
      vehicleType,
      primaryZoneId,
      avgDailyEarning,
      hoursPerDay,
      daysPerWeek,
      experienceMonths,
      upiId
    } = body;

    if (
      !name ||
      !phone ||
      !city ||
      !deliveryPlatform ||
      !vehicleType ||
      !primaryZoneId ||
      !upiId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: name, phone, city, deliveryPlatform, vehicleType, primaryZoneId, upiId',
        },
        { status: 400 }
      );
    }

    if (await existsByField<Worker>('workers.json', 'phone', phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const newWorker: Worker = {
      id: generateId('worker'),
      name,
      phone,
      city,
      primaryZoneId,
      deliveryPlatform,
      vehicleType,
      avgDailyEarning: avgDailyEarning || 750,
      hoursPerDay: hoursPerDay || 8,
      daysPerWeek: daysPerWeek || 6,
      experienceMonths: experienceMonths || 12,
      upiId,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      totalPayouts: 0
    };

    appendData('workers.json', newWorker);

    return NextResponse.json(
      {
        success: true,
        data: { worker: newWorker },
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