// app/api/worker/dashboard/[id]/route.ts
// GET /api/worker/dashboard/:id — Full worker dashboard data in ONE call
// This is what the worker mobile app hits on load

import { NextRequest, NextResponse } from 'next/server';
import { findById, readData } from '@/lib/db';
import { Worker, Policy, Claim, Weather, WeatherEvent } from '@/types';
import { startOfWeek, startOfMonth } from 'date-fns';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const worker = findById<Worker>('workers.json', id);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      );
    }

    // Get worker's policies
    const allPolicies = readData<Policy>('policies.json');
    const workerPolicies = allPolicies.filter((p) => p.workerId === id);
    const activePolicy = workerPolicies.find((p) => p.status === 'active') || null;

    // Get worker's claims
    const allClaims = readData<Claim>('claims.json');
    const workerClaims = allClaims.filter((c) => c.workerId === id);

    // Get current weather for worker's zone
    const allWeather = readData<Weather>('weather.json');
    const zoneWeather = allWeather
      .filter((w) => w.zoneId === worker.primaryZoneId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const currentWeather = zoneWeather.length > 0 ? zoneWeather[0] : null;

    // Get active events in worker's zone
    const allEvents = readData<WeatherEvent>('events.json');
    const activeEvents = allEvents.filter(
      (e) => e.zoneId === worker.primaryZoneId && e.isActive
    );

    // Time-based claim stats
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);

    const claimsThisWeek = workerClaims.filter((c) => {
      return new Date(c.claimDate) >= weekStart;
    });

    const claimsThisMonth = workerClaims.filter((c) => {
      return new Date(c.claimDate) >= monthStart;
    });

    // Total payouts received
    const totalPayouts = workerClaims
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.actualPayout, 0);

    // Strip password hash from worker
    const {...safeWorker } = worker;

    return NextResponse.json({
      success: true,
      data: {
        worker: safeWorker,
        activePolicy,
        currentWeather,
        activeEvents,
        recentClaims: workerClaims
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5),
        stats: {
          totalPolicies: workerPolicies.length,
          activePolicies: activePolicy ? 1 : 0,
          totalClaims: workerClaims.length,
          totalPayouts,
          claimsThisWeek: claimsThisWeek.length,
          claimsThisMonth: claimsThisMonth.length,
          pendingClaims: workerClaims.filter((c) => c.status === 'pending').length,
        },
      },
    });
  } catch (error) {
    console.error('GET /api/worker/dashboard/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}