// app/api/... (simulate event route)

import { NextRequest, NextResponse } from 'next/server';
import { readData, appendData, updateById } from '@/lib/db';
import { generateId, generatePaymentId } from '@/lib/id-generator';
import type { Zone, Worker, Policy, Claim, DisruptionEvent, WeatherData, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zoneId, eventType, severityTier } = body;

    if (!zoneId || !eventType || !severityTier) {
      return NextResponse.json({
        success: false,
        error: 'zoneId, eventType, and severityTier are required'
      } as ApiResponse<any>, { status: 400 });
    }

    // Get zone info
    const zones = await readData<Zone>('zones.json');
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) {
      return NextResponse.json({
        success: false,
        error: 'Zone not found'
      } as ApiResponse<any>, { status: 404 });
    }

    // Generate simulated weather
    const severityFactors: Record<string, number> = {
      T1: 0.30,
      T2: 0.60,
      T3: 0.85,
      T4: 1.00
    };

    const weatherScenarios: Record<string, any> = {
      'heavy_rain': { rainfall: severityTier === 'T4' ? 95 : severityTier === 'T3' ? 65 : severityTier === 'T2' ? 35 : 15, temperature: 26, aqi: 120, windSpeed: 45 },
      'flood': { rainfall: 120, temperature: 25, aqi: 150, windSpeed: 50 },
      'extreme_heat': { rainfall: 0, temperature: severityTier === 'T4' ? 48 : severityTier === 'T3' ? 45 : severityTier === 'T2' ? 43 : 41, aqi: 250, windSpeed: 8 },
      'pollution': { rainfall: 0, temperature: 22, aqi: severityTier === 'T4' ? 480 : severityTier === 'T3' ? 420 : severityTier === 'T2' ? 360 : 320, windSpeed: 5 },
      'strike': { rainfall: 0, temperature: 30, aqi: 180, windSpeed: 10 },
      'curfew': { rainfall: 0, temperature: 28, aqi: 150, windSpeed: 12 }
    };

    const weatherData = weatherScenarios[eventType] || weatherScenarios['heavy_rain'];

    // Save weather data
    const weather: WeatherData = {
      zoneId,
      timestamp: new Date().toISOString(),
      temperature: weatherData.temperature,
      rainfall: weatherData.rainfall,
      aqi: weatherData.aqi,
      windSpeed: weatherData.windSpeed,
      visibility: 1 + Math.random() * 8,
      source: 'simulation'
    };
    await appendData('weather.json', weather);

    // Create disruption event
    const durationHours = severityTier === 'T4' ? 8 : severityTier === 'T3' ? 6 : severityTier === 'T2' ? 4 : 2;
    
    const event: DisruptionEvent = {
      id: generateId('event'),
      eventType,
      severityTier,
      severityFactor: severityFactors[severityTier],
      zoneId,
      zoneName: zone.name,
      city: zone.city,
      eventStart: new Date().toISOString(),
      eventEnd: null,
      durationHours,
      measurements: {
        rainfall: weatherData.rainfall,
        temperature: weatherData.temperature,
        aqi: weatherData.aqi,
        windSpeed: weatherData.windSpeed
      },
      isVerified: true,
      claimsGenerated: 0,
      totalPayoutAmount: 0,
      createdAt: new Date().toISOString()
    };
    await appendData('events.json', event);

    // Find affected workers and policies
    const allWorkers = await readData<Worker>('workers.json');
    const allPolicies = await readData<Policy>('policies.json');
    
    const zoneWorkers = allWorkers.filter(w => w.primaryZoneId === zoneId);
    const activePolicies = allPolicies.filter(p => 
      p.status === 'active' && 
      zoneWorkers.some(w => w.id === p.workerId)
    );

    // Generate claims
    let totalPayout = 0;
    let autoApproved = 0;
    let manualReview = 0;
    let denied = 0;
    const createdClaims = [];

    for (const policy of activePolicies) {
      const worker = zoneWorkers.find(w => w.id === policy.workerId);
      if (!worker) continue;

      // Calculate payout
      const hoursAffected = durationHours;
      const hoursRatio = Math.min(hoursAffected / (worker.hoursPerDay || 8), 1);
      const calculatedPayout = Math.round(
        worker.avgDailyEarning * 
        (policy.coveragePercentage / 100) * 
        severityFactors[severityTier] * 
        hoursRatio
      );
      const approvedPayout = Math.min(calculatedPayout, policy.maxDailyPayout);

      // Simple fraud score (random for demo)
      const fraudScore = Math.floor(Math.random() * 80);
      
      let status: Claim['status'];
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

      const claim: Claim = {
        id: generateId('claim'),
        policyId: policy.id,
        workerId: worker.id,
        workerName: worker.name,
        eventId: event.id,
        claimDate: new Date().toISOString().split('T')[0],
        eventType,
        severityTier,
        dailyEarningBasis: worker.avgDailyEarning,
        coveragePercentage: policy.coveragePercentage,
        severityFactor: severityFactors[severityTier],
        hoursAffected,
        hoursRatio,
        calculatedPayout,
        approvedPayout: status === 'denied' ? 0 : approvedPayout,
        fraudScore,
        fraudFlags: [],
        status,
        paymentStatus: status === 'auto_approved' ? 'completed' : 'pending',
        paymentId: status === 'auto_approved' ? generatePaymentId() : undefined,
        paidAt: status === 'auto_approved' ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString()
      };

      await appendData('claims.json', claim);
      createdClaims.push(claim);

      if (status === 'auto_approved') {
        totalPayout += approvedPayout;
        
        await appendData('payments.json', {
          id: claim.paymentId!,
          claimId: claim.id,
          workerId: worker.id,
          amount: approvedPayout,
          method: 'upi',
          upiId: worker.upiId,
          status: 'completed',
          transactionId: `UPI${Date.now()}${Math.random().toString(36).substr(2, 6)}`,
          initiatedAt: claim.createdAt,
          completedAt: claim.paidAt
        });
      }

      // Create fraud alert if score > 45
      if (fraudScore > 45) {
        await appendData('fraud_alerts.json', {
          id: generateId('fraud_alert'),
          workerId: worker.id,
          claimId: claim.id,
          alertType: fraudScore > 70 ? 'abnormal_pattern' : 'location_anomaly',
          severity: fraudScore > 70 ? 'critical' : 'high',
          confidence: fraudScore,
          details: [
            `System detected elevated risk score (${fraudScore}/100)`,
            `Requires manual verification`
          ],
          status: 'open',
          createdAt: new Date().toISOString()
        });
      }
    }

    // Update the event record with actual totals
    await updateById<DisruptionEvent>('events.json', event.id, {
      claimsGenerated: createdClaims.length,
      totalPayoutAmount: totalPayout
    });

    // Return the summary
    return NextResponse.json({
      success: true,
      data: {
        event,
        summary: {
          totalClaims: createdClaims.length,
          autoApproved,
          manualReview,
          denied,
          totalPayout
        }
      }
    } as ApiResponse<any>);
    
  } catch (error) {
    console.error('Simulate event error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to simulate event'
    } as ApiResponse<any>, { status: 500 });
  }
}