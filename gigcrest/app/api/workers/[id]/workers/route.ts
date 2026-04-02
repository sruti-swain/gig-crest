// app/api/zones/[id]/workers/route.ts
// GET /api/zones/:id/workers — All workers in a specific zone

import { NextRequest, NextResponse } from 'next/server';
import { readData, findById } from '@/lib/db';
import { Worker, Zone } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify zone exists
    const zone = findById<Zone>('zones.json', id);
    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Zone not found' },
        { status: 404 }
      );
    }

    // Get workers in this zone
    const allWorkers = readData<Worker>('workers.json');
    const zoneWorkers = allWorkers
      .filter((w) => w.primaryZoneId === id)
      .map(({  ...rest }) => rest); // strip passwords

    return NextResponse.json({
      success: true,
      data: {
        zone: { id: zone.id, name: zone.name, city: zone.city },
        workers: zoneWorkers,
        total: zoneWorkers.length,
      },
    });
  } catch (error) {
    console.error('GET /api/zones/[id]/workers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zone workers' },
      { status: 500 }
    );
  }
}