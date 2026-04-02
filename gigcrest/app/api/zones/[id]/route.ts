// app/api/zones/[id]/route.ts
// GET /api/zones/:id — Single zone details with current weather

import { NextRequest, NextResponse } from 'next/server';
import { findById, readData } from '@/lib/db';
import { Zone, Weather } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const zone = findById<Zone>('zones.json', id);

    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Zone not found' },
        { status: 404 }
      );
    }

    // Get latest weather for this zone
    const allWeather = readData<Weather>('weather.json');
    const zoneWeather = allWeather
      .filter((w) => w.zoneId === id)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    const currentWeather = zoneWeather.length > 0 ? zoneWeather[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        zone,
        currentWeather,
      },
    });
  } catch (error) {
    console.error('GET /api/zones/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zone' },
      { status: 500 }
    );
  }
}