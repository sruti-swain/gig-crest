// app/api/workers/[id]/stats/route.ts
// GET /api/workers/:id/stats — Worker statistics and history

import { NextRequest, NextResponse } from 'next/server';
import { findById, readData } from '@/lib/db';
import { Worker, Policy, Claim, Payment } from '@/types';
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

    // Get all related data
    const allPolicies = readData<Policy>('policies.json');
    const allClaims = readData<Claim>('claims.json');
    const allPayments = readData<Payment>('payments.json');

    const workerPolicies = allPolicies.filter((p) => p.workerId === id);
    const workerClaims = allClaims.filter((c) => c.workerId === id);
    const workerPayments = allPayments.filter((p) => p.workerId === id);

    // Time-based filters
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);

    const claimsThisWeek = workerClaims.filter((c) => {
      const claimDate = new Date(c.claimDate);
      return claimDate >= weekStart && claimDate <= now;
    });

    const claimsThisMonth = workerClaims.filter((c) => {
      const claimDate = new Date(c.claimDate);
      return claimDate >= monthStart && claimDate <= now;
    });

    // Calculate statistics
    const totalPremiumsPaid = workerPolicies
      .filter((p) => p.paymentStatus === 'paid')
      .reduce((sum, p) => sum + p.finalPremium, 0);

    const totalPayoutsReceived = workerClaims
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.actualPayout, 0);

    const avgClaimPayout = workerClaims.length > 0
      ? Math.round(
          workerClaims
            .filter((c) => c.status === 'paid')
            .reduce((sum, c) => sum + c.actualPayout, 0) /
          Math.max(workerClaims.filter((c) => c.status === 'paid').length, 1)
        )
      : 0;

    const claimApprovalRate = workerClaims.length > 0
      ? Math.round(
          (workerClaims.filter((c) => ['approved', 'paid'].includes(c.status)).length /
            workerClaims.length) *
            100
        )
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        worker: {
          id: worker.id,
          name: worker.name,
          profileScore: worker.profileScore,
        },
        stats: {
          totalPolicies: workerPolicies.length,
          activePolicies: workerPolicies.filter((p) => p.status === 'active').length,
          totalClaims: workerClaims.length,
          claimsThisWeek: claimsThisWeek.length,
          claimsThisMonth: claimsThisMonth.length,
          totalPremiumsPaid,
          totalPayoutsReceived,
          avgClaimPayout,
          claimApprovalRate,
          totalPayments: workerPayments.length,
          netBenefit: totalPayoutsReceived - totalPremiumsPaid, // positive = worker benefited
        },
        claimsByStatus: {
          pending: workerClaims.filter((c) => c.status === 'pending').length,
          under_review: workerClaims.filter((c) => c.status === 'under_review').length,
          approved: workerClaims.filter((c) => c.status === 'approved').length,
          denied: workerClaims.filter((c) => c.status === 'denied').length,
          paid: workerClaims.filter((c) => c.status === 'paid').length,
        },
        recentClaims: workerClaims
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5),
        recentPayments: workerPayments
          .sort((a, b) => (b.completedAt || b.initiatedAt).localeCompare(a.completedAt || a.initiatedAt))
          .slice(0, 5),
      },
    });
  } catch (error) {
    console.error('GET /api/workers/[id]/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch worker stats' },
      { status: 500 }
    );
  }
}