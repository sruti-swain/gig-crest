// app/api/policies/route.ts
// GET  /api/policies — List policies (with filters)
// POST /api/policies — Create a new policy

import { NextRequest, NextResponse } from 'next/server';
import { readData, appendData, findById } from '@/lib/db';
import { generateId } from '@/lib/id-generator';
import { Policy, Worker, Zone } from '@/types';
import { startOfWeek, endOfWeek, format } from 'date-fns';

// GET — List all policies with optional filters
export async function GET(request: NextRequest) {
  try {
    const policies = readData<Policy>('policies.json');

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');
    const status = searchParams.get('status');
    const zoneId = searchParams.get('zoneId');

    let filtered = policies;

    if (workerId) {
      filtered = filtered.filter((p) => p.workerId === workerId);
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (zoneId) {
      filtered = filtered.filter((p) => p.zoneId === zoneId);
    }

    // Sort by newest first
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({
      success: true,
      data: {
        policies: filtered,
        total: filtered.length,
      },
    });
  } catch (error) {
    console.error('GET /api/policies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch policies' },
      { status: 500 }
    );
  }
}

// POST — Create a new policy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, zoneId } = body;

    if (!workerId || !zoneId) {
      return NextResponse.json(
        { success: false, error: 'workerId and zoneId are required' },
        { status: 400 }
      );
    }

    // Verify worker exists
    const worker = findById<Worker>('workers.json', workerId);
    if (!worker) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      );
    }

    // Verify zone exists
    const zone = findById<Zone>('zones.json', zoneId);
    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Zone not found' },
        { status: 404 }
      );
    }

    // Check if worker already has an active policy
    const existingPolicies = readData<Policy>('policies.json');
    const hasActive = existingPolicies.some(
      (p) => p.workerId === workerId && p.status === 'active'
    );
    if (hasActive) {
      return NextResponse.json(
        { success: false, error: 'Worker already has an active policy' },
        { status: 409 }
      );
    }

    // Try to call Person 5's premium calculator
    // If it's not available yet, use fallback calculation
    let premiumData;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
      const premiumRes = await fetch(`${baseUrl}/api/premium/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, zoneId }),
      });

      if (premiumRes.ok) {
        const result = await premiumRes.json();
        if (result.success) {
          premiumData = result.data.premium;
        }
      }
    } catch {
      // Person 5's API not available — use fallback
      console.log('Premium API not available, using fallback calculation');
    }

    // Fallback premium calculation if Person 5's API isn't ready
    if (!premiumData) {
      const basePremium = Math.round(worker.avgDailyEarnings * 0.08); // ~8% of daily earnings
      const zoneLoading = Math.round(basePremium * (zone.baseRiskScore / 200)); // risk-based
      const seasonLoading = Math.round(basePremium * 0.1); // 10% season surcharge
      const platformLoading = 0;
      const behavioralDiscount = Math.round(
        basePremium * (worker.profileScore / 500) // higher profile = more discount
      );
      const finalPremium = basePremium + zoneLoading + seasonLoading + platformLoading - behavioralDiscount;

      premiumData = {
        basePremium,
        zoneLoading,
        seasonLoading,
        platformLoading,
        behavioralDiscount,
        finalPremium: Math.max(finalPremium, 15), // minimum ₹15
        coverageDetails: {
          coveragePercentage: 60,
          maxDailyPayout: Math.round(worker.avgDailyEarnings * 0.6),
          maxWeeklyPayouts: 3,
          maxMonthlyPayouts: 8,
        },
      };
    }

    // Calculate week boundaries (Monday to Sunday)
    const now = new Date();
    const weekStart = format(
      startOfWeek(now, { weekStartsOn: 1 }), // Monday
      'yyyy-MM-dd'
    );
    const weekEnd = format(
      endOfWeek(now, { weekStartsOn: 1 }), // Sunday
      'yyyy-MM-dd'
    );

    const policy: Policy = {
      id: generateId('policy'),
      workerId,
      workerName: worker.name,
      zoneId,
      zoneName: zone.name,
      weekStart,
      weekEnd,
      coveragePercentage: premiumData.coverageDetails.coveragePercentage,
      maxDailyPayout: premiumData.coverageDetails.maxDailyPayout,
      maxWeeklyPayouts: premiumData.coverageDetails.maxWeeklyPayouts,
      maxMonthlyPayouts: premiumData.coverageDetails.maxMonthlyPayouts,
      basePremium: premiumData.basePremium,
      zoneLoading: premiumData.zoneLoading,
      seasonLoading: premiumData.seasonLoading,
      platformLoading: premiumData.platformLoading,
      behavioralDiscount: premiumData.behavioralDiscount,
      finalPremium: premiumData.finalPremium,
      status: 'active',
      paymentStatus: 'paid', // mock — assume payment succeeds
      paymentMethod: 'upi',
      renewalCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appendData('policies.json', policy);

    return NextResponse.json(
      {
        success: true,
        data: { policy, premium: premiumData },
        message: 'Policy created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/policies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create policy' },
      { status: 500 }
    );
  }
}