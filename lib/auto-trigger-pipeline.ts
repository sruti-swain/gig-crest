import { appendData, findById, readData, updateById } from '@/lib/db';
import { generateId } from '@/lib/id-generator';
import { detectDisruptions } from '@/lib/disruption-detector';
import { generateSimulatedWeather } from '@/lib/mock-weather-generator';

function estimateDuration(severityTier: 'T1' | 'T2' | 'T3' | 'T4') {
  return {
    T1: 2,
    T2: 4,
    T3: 6,
    T4: 8,
  }[severityTier];
}
async function countClaimsThisWeek(workerId: string) {
  const claims = await readData<any>('claims.json');
  return claims.filter((c) => c.workerId === workerId).length;
}

async function countClaimsThisMonth(workerId: string) {
  const claims = await readData<any>('claims.json');
  return claims.filter((c) => c.workerId === workerId).length;
}

async function getPayout(payload: any) {
  try {
    const res = await fetch(`http://localhost:3000/api/payout/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.success) return data;
  } catch (e) {}

  return {
    success: true,
    data: {
      payout: {
        eligible: true,
        breakdown: { hoursRatio: 0.5 },
        calculatedAmount: 250,
        approvedAmount: 200,
      },
    },
  };
}

async function getFraudScore(payload: any) {
  try {
    const res = await fetch(`http://localhost:3000/api/fraud/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.success) return data;
  } catch (e) {}

  const randomScore = Math.floor(Math.random() * 80) + 5;
  return {
    success: true,
    data: {
      fraud: {
        totalScore: randomScore,
        flags: randomScore > 45 ? [{ type: 'suspicious_pattern', score: randomScore }] : [],
      },
    },
  };
}

export async function runAutoTrigger(
  zoneId?: string,
  eventType?: any,
  severityTier?: 'T1' | 'T2' | 'T3' | 'T4'
) {
  const weather = generateSimulatedWeather(zoneId || 'zone_001', eventType || 'heavy_rain', severityTier || 'T2');

  appendData('weather.json', {
    ...weather,
    timestamp: new Date().toISOString(),
    source: 'simulation',
  });

  const detected = detectDisruptions(weather);
  if (!detected.length) {
    return {
      success: true,
      data: { message: 'No disruptions detected', events: [] },
    };
  }

  const createdEvents = [];

  for (const disruption of detected) {
    const zone = await findById<any>('zones.json', zoneId || weather.zoneId);

    const event = {
      id: generateId('event'),
      eventType: disruption.eventType,
      severityTier: disruption.severityTier,
      severityFactor: disruption.severityFactor,
      zoneId: zone?.id || weather.zoneId,
      zoneName: zone?.name || 'Unknown Zone',
      city: zone?.city || 'Unknown City',
      eventStart: new Date().toISOString(),
      eventEnd: null,
      durationHours: estimateDuration(disruption.severityTier),
      measurements: disruption.measurements,
      isVerified: true,
      isActive: true,
      claimsGenerated: 0,
      totalPayoutAmount: 0,
      createdAt: new Date().toISOString(),
    };

    appendData('events.json', event);

    const allPolicies =await  readData<any>('policies.json');
    const allWorkers = await readData<any>('workers.json');

    const activePolicies = allPolicies.filter(
      (p) =>
        p.status === 'active' &&
        allWorkers.find((w) => w.id === p.workerId)?.primaryZoneId === event.zoneId
    );

    const createdClaims = [];
    let totalPayout = 0;
    let autoApproved = 0;
    let manualReview = 0;
    let denied = 0;

    for (const policy of activePolicies) {
      const worker = allWorkers.find((w) => w.id === policy.workerId);
      if (!worker) continue;

      const payoutData = await getPayout({
        workerId: worker.id,
        eventId: event.id,
        severityTier: event.severityTier,
        hoursAffected: estimateDuration(event.severityTier),
        avgDailyEarning: worker.avgDailyEarning,
        avgHoursPerDay: worker.avgHoursPerDay,
        claimsThisWeek: countClaimsThisWeek(worker.id),
        claimsThisMonth: countClaimsThisMonth(worker.id),
        maxWeeklyPayouts: policy.maxWeeklyPayouts,
        maxMonthlyPayouts: policy.maxMonthlyPayouts,
        maxDailyPayout: policy.maxDailyPayout,
      });

      if (!payoutData?.data?.payout?.eligible) continue;

      const fraudData = await getFraudScore({
        workerId: worker.id,
        claimDate: new Date().toISOString(),
        eventId: event.id,
        zoneId: event.zoneId,
      });

      const fraudScore = fraudData?.data?.fraud?.totalScore || 0;
      let status = 'auto_approved';

      if (fraudScore <= 45) {
        status = 'auto_approved';
        autoApproved++;
      } else if (fraudScore <= 70) {
        status = 'manual_review';
        manualReview++;
      } else {
        status = 'denied';
        denied++;
      }

      const approvedPayout =
        status === 'denied' ? 0 : payoutData.data.payout.approvedAmount;

      const claim = {
        id: generateId('claim'),
        policyId: policy.id,
        workerId: worker.id,
        workerName: worker.name,
        eventId: event.id,
        claimDate: new Date().toISOString().split('T')[0],
        eventType: event.eventType,
        severityTier: event.severityTier,
        dailyEarningBasis: worker.avgDailyEarning,
        coveragePercentage: policy.coveragePercentage,
        severityFactor: event.severityFactor,
        hoursAffected: estimateDuration(event.severityTier),
        hoursRatio: payoutData.data.payout.breakdown.hoursRatio,
        calculatedPayout: payoutData.data.payout.calculatedAmount,
        approvedPayout,
        fraudScore,
        fraudFlags: fraudData?.data?.fraud?.flags || [],
        status,
        paymentStatus: status === 'auto_approved' ? 'completed' : 'pending',
        paymentId:
          status === 'auto_approved'
            ? `TXN_GS_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            : null,
        paidAt: status === 'auto_approved' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
      };

      appendData('claims.json', claim);
      createdClaims.push(claim);

      if (status === 'auto_approved') {
        totalPayout += approvedPayout;

        appendData('payments.json', {
          id: generateId('payment'),
          claimId: claim.id,
          workerId: worker.id,
          amount: approvedPayout,
          paymentMethod: 'upi',
          status: 'completed',
          transactionId: claim.paymentId,
          paidAt: claim.paidAt,
          createdAt: new Date().toISOString(),
        });
      }

      if (fraudScore > 45) {
        appendData('fraud_alerts.json', {
          id: generateId('fraud'),
          workerId: worker.id,
          claimId: claim.id,
          alertType: fraudData?.data?.fraud?.flags?.[0]?.type || 'unknown',
          severity: fraudScore > 70 ? 'critical' : 'high',
          confidence: fraudScore,
          details: fraudData?.data?.fraud?.flags || [],
          status: 'open',
          createdAt: new Date().toISOString(),
        });
      }
    }

    updateById<any>('events.json', event.id, {
  claimsGenerated: createdClaims.length,
  totalPayoutAmount: totalPayout,
});

    createdEvents.push({
      ...event,
      claimsGenerated: createdClaims.length,
      totalPayoutAmount: totalPayout,
      summary: {
        totalClaims: createdClaims.length,
        autoApproved,
        manualReview,
        denied,
        totalPayout,
      },
      claims: createdClaims,
    });
  }

  return {
    success: true,
    data: {
      events: createdEvents,
    },
  };
}