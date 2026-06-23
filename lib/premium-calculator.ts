import { Zone, Worker } from '../types/index.js';

export interface PremiumCalculationResult {
  basePremium: number;
  zoneLoading: number;
  seasonLoading: number;
  platformLoading: number;
  behavioralDiscount: number;
  finalPremium: number;
  coverageDetails: {
    coveragePercentage: number;
    maxDailyPayout: number;
    maxWeeklyPayouts: number;
    maxMonthlyPayouts: number;
  };
}

export function calculatePremium(worker: Worker, zone: Zone): PremiumCalculationResult {
  const basePremium = 99;
  
  // Zone Loading
  let zoneLoading = 0;
  if (zone.riskLevel === 'high') zoneLoading = 45;
  else if (zone.riskLevel === 'medium') zoneLoading = 25;
  
  // Season Loading (Mocking Monsoon for now)
  const isMonsoon = true; 
  const seasonLoading = isMonsoon ? 59 : 0;
  
  // Platform Loading
  const platformLoading = worker.deliveryPlatform === 'both' ? 15 : 0;
  
  // Behavioral Discount (Mocking good behavior)
  const behavioralDiscount = worker.experienceMonths > 12 ? 15 : 0;
  
  const finalPremium = basePremium + zoneLoading + seasonLoading + platformLoading - behavioralDiscount;
  
  return {
    basePremium,
    zoneLoading,
    seasonLoading,
    platformLoading,
    behavioralDiscount,
    finalPremium,
    coverageDetails: {
      coveragePercentage: 75,
      maxDailyPayout: Math.floor(worker.avgDailyEarning * 0.8),
      maxWeeklyPayouts: 3,
      maxMonthlyPayouts: 8
    }
  };
}
