// lib/fraud-scorer.ts
import { readData } from '@/lib/db';
import type { Worker, Claim } from '@/types';

export interface FraudScoreResult {
  totalScore: number;
  flags: { type: string; score: number; detail: string }[];
}

/**
 * Pure calculation function - no async needed
 */
export function scoreClaim(claimData: any, context: any): FraudScoreResult {
  const flags: { type: string; score: number; detail: string }[] = [];
  let totalScore = 0;

  // 1. Location Spoofing Check
  if (context.distanceMismatch > 5) {
    const score = 40;
    flags.push({ 
      type: 'location_spoofing', 
      score, 
      detail: `Distance mismatch: ${context.distanceMismatch}km` 
    });
    totalScore += score;
  }

  // 2. Device Integrity
  if (context.isRooted) {
    const score = 30;
    flags.push({ 
      type: 'device_integrity', 
      score, 
      detail: 'Device is rooted/jailbroken' 
    });
    totalScore += score;
  }

  // 3. Multiple Accounts
  if (context.similarUpiFound) {
    const score = 25;
    flags.push({ 
      type: 'multi_account', 
      score, 
      detail: 'UPI ID linked to multiple workers' 
    });
    totalScore += score;
  }

  // 4. Impossible Travel
  if (context.impossibleTravel) {
    const score = 50;
    flags.push({ 
      type: 'impossible_travel', 
      score, 
      detail: 'Impossible travel detected between claims' 
    });
    totalScore += score;
  }

  return {
    totalScore: Math.min(totalScore, 100),
    flags
  };
}

/**
 * Async wrapper that fetches context data from DB
 * This is what your API should call
 */
export async function calculateFraudScore(data: {
  workerId: string;
  claimAmount: number;
  eventType?: string;
  zoneId?: string;
  location?: { lat: number; lng: number };
}): Promise<FraudScoreResult> {
  
  // Fetch necessary data
  const workers = await readData<Worker>('workers.json');
  const claims = await readData<Claim>('claims.json');

  const worker = workers.find(w => w.id === data.workerId);
  if (!worker) {
    return {
      totalScore: 100,
      flags: [{ type: 'invalid_worker', score: 100, detail: 'Worker not found' }]
    };
  }

  // Build context by analyzing historical data
  const workerClaims = claims.filter(c => c.workerId === data.workerId);
  
  // Check for duplicate UPI (mocked for demo)
  const similarUpiFound = workers.filter(
    w => w.upiId === worker.upiId && w.id !== worker.id
  ).length > 0;

  // Check claim frequency for impossible travel (simplified)
  const recentClaims = workerClaims
    .filter(c => {
      const claimDate = new Date(c.claimDate);
      const now = new Date();
      const hoursDiff = (now.getTime() - claimDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24;
    });
  
  const impossibleTravel = recentClaims.length > 3;

  // Mock distance check (in real system, compare GPS coords)
  const distanceMismatch = Math.random() > 0.8 ? 7 : 2;

  // Mock device integrity
  const isRooted = Math.random() > 0.9;

  // Build context object
  const context = {
    distanceMismatch,
    isRooted,
    similarUpiFound,
    impossibleTravel,
    claimHistory: workerClaims.length,
    avgClaimAmount: workerClaims.length > 0 
      ? workerClaims.reduce((sum, c) => sum + (c.approvedPayout || 0), 0) / workerClaims.length
      : 0
  };

  // Call the pure scoring function
  return scoreClaim(data, context);
}