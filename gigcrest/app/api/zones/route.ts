// app/api/zones/route.ts
// GET /api/zones — List all zones (with optional city filter)

import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import { Zone } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const zones = readData<Zone>('zones.json');

    // Optional city filter
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    let filtered = zones;
    if (city) {
      filtered = filtered.filter(
        (z) => z.city.toLowerCase() === city.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        zones: filtered,
        total: filtered.length,
      },
    });
  } catch (error) {
    console.error('GET /api/zones error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zones' },
      { status: 500 }
    );
  }
}