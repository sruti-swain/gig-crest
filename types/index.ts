export type SeverityTier = 'T1' | 'T2' | 'T3' | 'T4';
export type EventType = 'rain' | 'heavy_rain' | 'flood' | 'heat' | 'extreme_heat' | 'aqi' | 'pollution' | 'strike' | 'curfew';
export type ClaimStatus = "pending" | "under_review" | "manual_review" | "auto_approved" | "approved" | "denied" | "paid";
export type PaymentMethod = "upi" | "wallet";
export type PaymentStatus = "initiated" | "completed" | "failed";

export interface Worker {
  id: string;
  name: string;
  phone: string;
  city: string;
  primaryZoneId: string;
  deliveryPlatform: "swiggy" | "zomato" | "both" | "other";
  vehicleType: "bike" | "bicycle" | "e-bike";
  avgDailyEarning: number;
  hoursPerDay: number;
  daysPerWeek: number;
  experienceMonths: number;
  upiId: string;
  createdAt: string;

  isActive?: boolean;
  totalPayouts?: number;
  updatedAt?: string;
  avgDailyEarnings?: number;
  profileScore?: number;
}

export interface Zone {
  id: string;
  name: string;
  city: string;
  coordinates: { lat: number; lng: number };
  radius: number;
  riskLevel: "low" | "medium" | "high";
  basePremiumFactor: number;
  baseRiskScore?: number;
}

export interface PremiumBreakdown {
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

export interface Policy {
  id: string;
  workerId: string;
  weekStart: string;
  weekEnd: string;
  coveragePercentage: number;
  maxDailyPayout: number;
  maxWeeklyPayouts: number;
  maxMonthlyPayouts: number;
  basePremium: number;
  finalPremium: number;
  status: "active" | "expired" | "cancelled";
  paymentStatus: "paid" | "pending";
  createdAt: string;

  workerName?: string;
  zoneId?: string;
  zoneName?: string;
  zoneLoading?: number;
  seasonLoading?: number;
  platformLoading?: number;
  behavioralDiscount?: number;
  paymentMethod?: PaymentMethod;
  renewalCount?: number;
  updatedAt?: string;
}

export interface FraudFlag {
  type: string;
  severity?: "low" | "medium" | "high" | "critical";
  score: number;
  description: string;
  evidence?: unknown;
}

export interface Claim {
  id: string;
  policyId: string;
  workerId: string;
  workerName: string;
  eventId: string;
  claimDate: string;
  eventType: EventType;
  severityTier: SeverityTier;
  dailyEarningBasis: number;
  coveragePercentage: number;
  severityFactor?: number;
  hoursAffected?: number;
  hoursRatio: number;
  calculatedPayout: number;
  approvedPayout: number;
  fraudScore: number;
  fraudFlags?: FraudFlag[];
  status: ClaimStatus;
  paymentStatus: "pending" | "completed" | "failed";
  paymentId?: string;
  paidAt?: string;
  createdAt: string;

  actualPayout?: number;
  paymentMethod?: PaymentMethod;
  updatedAt?: string;
  zoneId?: string;
  claimType?: string;
}

export interface WeatherData {
  zoneId: string;
  temperature: number;
  rainfall: number;
  aqi: number;
  windSpeed: number;
  visibility: number;
  timestamp: string;
  source: 'real' | 'simulation';
  weatherCondition?: string;
}

export interface DisruptionEvent {
  id: string;
  eventType: EventType;
  severityTier: SeverityTier;
  severityFactor: number;
  zoneId: string;
  zoneName: string;
  city: string;
  eventStart: string;
  eventEnd: string | null;
  durationHours: number;
  measurements: {
    rainfall?: number;
    temperature?: number;
    aqi?: number;
    windSpeed?: number;
  };
  isVerified: boolean;
  isActive?: boolean;
  claimsGenerated: number;
  totalPayoutAmount: number;
  createdAt: string;
}

export type WeatherEvent = DisruptionEvent;

export interface FraudAlert {
  id: string;
  workerId: string;
  claimId: string;
  alertType: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  details: string[];
  status: "open" | "investigating" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  phone: string;
  otp: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  city: string;
  primaryZoneId: string;
  deliveryPlatform: "swiggy" | "zomato" | "both" | "other";
  vehicleType: "bike" | "bicycle" | "e-bike";
  upiId: string;

  avgDailyEarning?: number;
  hoursPerDay?: number;
  daysPerWeek?: number;
  experienceMonths?: number;
}

export interface Payment {
  id: string;
  claimId: string;
  workerId: string;
  amount: number;
  method: PaymentMethod;
  upiId: string;
  transactionId: string;
  status: PaymentStatus;
  initiatedAt: string;
  completedAt?: string;
  workerName?: string;
  workerPhone?: string;
}

export interface AdminStats {
  activeEvents: number;
  activePolicies: number;
  totalWorkers: number;
  activeWorkers: number;
  claimsToday: number;
  claimsPending: number;
  fraudAlerts: number;
  payoutToday: number;
  premiumsThisWeek: number;
  payoutsThisWeek: number;
  lossRatio: number;
  reserveBalance: number;
  weeklyTrend: WeeklyTrend[];
  claimsByStatus: Record<string, number>;
  eventsByType: Record<string, number>;
}

export interface WeeklyTrend {
  week: string;
  premiums: number;
  payouts: number;
  claims: number;
  policies: number;
}