// app/api/admin/stats/route.ts
// GET /api/admin/stats — Full admin dashboard aggregation
// This is the MOST COMPLEX API — reads from ALL data files

import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import {
  Worker,
  Zone,
  Policy,
  Claim,
  WeatherEvent,
  FraudAlert,
  Payment,
  AdminStats,
  WeeklyTrend,
} from '@/types';
import { startOfWeek, subWeeks, format } from 'date-fns';

export async function GET() {
  try {
    // Read all data files
    const workers = readData<Worker>('workers.json');
    const zones = readData<Zone>('zones.json');
    const policies = readData<Policy>('policies.json');
    const claims = readData<Claim>('claims.json');
    const events = readData<WeatherEvent>('events.json');
    const fraudAlerts = readData<FraudAlert>('fraud_alerts.json');
    const payments = readData<Payment>('payments.json');

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });

    // ─── Basic counts ───
    const activeEvents = events.filter((e) => e.isActive).length;
    const activePolicies = policies.filter((p) => p.status === 'active').length;
    const totalWorkers = workers.length;
    const activeWorkers = workers.filter((w) => w.isActive).length;

    // ─── Claims today ───
    const claimsToday = claims.filter((c) => c.claimDate === today).length;
    const claimsPending = claims.filter(
      (c) => c.status === 'pending' || c.status === 'under_review'
    ).length;

    // ─── Fraud alerts ───
    const openFraudAlerts = fraudAlerts.filter(
      (a) => a.status === 'open' || a.status === 'investigating'
    ).length;

    // ─── Payout today ───
    const payoutToday = claims
      .filter((c) => c.claimDate === today && c.status === 'paid')
      .reduce((sum, c) => sum + c.actualPayout, 0);

    // ─── This week totals ───
    const policiesThisWeek = policies.filter((p) => {
      return new Date(p.createdAt) >= thisWeekStart;
    });

    const claimsThisWeek = claims.filter((c) => {
      return new Date(c.claimDate) >= thisWeekStart;
    });

    const premiumsThisWeek = policiesThisWeek
      .filter((p) => p.paymentStatus === 'paid')
      .reduce((sum, p) => sum + p.finalPremium, 0);

    const payoutsThisWeek = claimsThisWeek
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.actualPayout, 0);

    // ─── Loss ratio (payouts / premiums) ───
    const totalPremiums = policies
      .filter((p) => p.paymentStatus === 'paid')
      .reduce((sum, p) => sum + p.finalPremium, 0);

    const totalPayouts = claims
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.actualPayout, 0);

    const lossRatio = totalPremiums > 0
      ? Math.round((totalPayouts / totalPremiums) * 100) / 100
      : 0;

    // ─── Reserve balance (premiums collected - payouts made) ───
    const reserveBalance = totalPremiums - totalPayouts;

    // ─── Claims by status ───
    const claimsByStatus: Record<string, number> = {
      pending: claims.filter((c) => c.status === 'pending').length,
      under_review: claims.filter((c) => c.status === 'under_review').length,
      approved: claims.filter((c) => c.status === 'approved').length,
      denied: claims.filter((c) => c.status === 'denied').length,
      paid: claims.filter((c) => c.status === 'paid').length,
    };

    // ─── Events by type ───
    const eventsByType: Record<string, number> = {};
    events.forEach((e) => {
      eventsByType[e.eventType] = (eventsByType[e.eventType] || 0) + 1;
    });

    // ─── Weekly trend (last 4 weeks) ───
    const weeklyTrend: WeeklyTrend[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = subWeeks(thisWeekStart, i);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekLabel = format(weekStart, 'MMM dd');

      const weekPolicies = policies.filter((p) => {
        const d = new Date(p.createdAt);
        return d >= weekStart && d <= weekEnd;
      });

      const weekClaims = claims.filter((c) => {
        const d = new Date(c.claimDate);
        return d >= weekStart && d <= weekEnd;
      });

      weeklyTrend.push({
        week: weekLabel,
        premiums: weekPolicies
          .filter((p) => p.paymentStatus === 'paid')
          .reduce((sum, p) => sum + p.finalPremium, 0),
        payouts: weekClaims
          .filter((c) => c.status === 'paid')
          .reduce((sum, c) => sum + c.actualPayout, 0),
        claims: weekClaims.length,
        policies: weekPolicies.length,
      });
    }

    // ─── Top affected zones ───
    const topZones = zones
      .map((zone) => {
        const zoneClaims = claims.filter((c) => c.zoneId === zone.id);
        const zoneEvents = events.filter((e) => e.zoneId === zone.id);
        return {
          id: zone.id,
          name: zone.name,
          city: zone.city,
          totalClaims: zoneClaims.length,
          activeEvents: zoneEvents.filter((e) => e.isActive).length,
          totalPayouts: zoneClaims
            .filter((c) => c.status === 'paid')
            .reduce((sum, c) => sum + c.actualPayout, 0),
          riskScore: zone.baseRiskScore,
        };
      })
      .sort((a, b) => b.totalClaims - a.totalClaims)
      .slice(0, 5);

    // ─── Recent activity ───
    const recentClaims = claims
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10);

    const recentPayments = payments
      .sort((a, b) => (b.completedAt || b.initiatedAt).localeCompare(a.completedAt || a.initiatedAt))
      .slice(0, 10);

    const stats: AdminStats = {
      activeEvents,
      activePolicies,
      totalWorkers,
      activeWorkers,
      claimsToday,
      claimsPending,
      fraudAlerts: openFraudAlerts,
      payoutToday,
      premiumsThisWeek,
      payoutsThisWeek,
      lossRatio,
      reserveBalance,
      weeklyTrend,
      claimsByStatus,
      eventsByType,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        topZones,
        recentClaims,
        recentPayments,
        activeEventsList: events.filter((e) => e.isActive),
        openFraudAlerts: fraudAlerts.filter(
          (a) => a.status === 'open' || a.status === 'investigating'
        ),
      },
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}