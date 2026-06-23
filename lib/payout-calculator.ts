import { Claim, SeverityTier } from '../types/index.js';

export interface PayoutResult {
  eligible: boolean;
  calculatedAmount: number;
  approvedAmount: number;
  breakdown: {
    dailyEarningBasis: number;
    coveragePercentage: number;
    severityFactor: number;
    hoursRatio: number;
  };
}

const SEVERITY_FACTORS: Record<SeverityTier, number> = {
  T1: 0.3,
  T2: 0.6,
  T3: 0.85,
  T4: 1.0
};

export function calculatePayout(
  avgDailyEarning: number,
  severityTier: SeverityTier,
  hoursAffected: number,
  avgHoursPerDay: number,
  coveragePercentage: number
): PayoutResult {
  const severityFactor = SEVERITY_FACTORS[severityTier];
  const hoursRatio = Math.min(hoursAffected / avgHoursPerDay, 1.0);
  
  const calculatedAmount = Math.floor(
    avgDailyEarning * (coveragePercentage / 100) * severityFactor * hoursRatio
  );

  return {
    eligible: calculatedAmount > 0,
    calculatedAmount,
    approvedAmount: calculatedAmount, // Default to calculated, fraud scorer might adjust
    breakdown: {
      dailyEarningBasis: avgDailyEarning,
      coveragePercentage,
      severityFactor,
      hoursRatio
    }
  };
}
