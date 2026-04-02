// types/index.ts
// SHARED TYPES — Everyone in the team imports from here
// Person 3 owns this file. Do NOT edit without coordinating.

// ─────────────────────────────────────────────
// API Response wrapper — every API returns this shape
// ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─────────────────────────────────────────────
// WORKER — A gig delivery worker like Amit
// ─────────────────────────────────────────────
export interface Worker {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  platform: 'zomato' | 'swiggy' | 'blinkit' | 'zepto' | 'dunzo' | 'other';
  vehicleType: 'scooter' | 'bike' | 'bicycle' | 'auto';
  primaryZoneId: string;
  avgDailyEarnings: number;        // in rupees
  avgWorkingHoursPerDay: number;
  workingDaysPerWeek: number;
  monthlyIncome: number;           // calculated or self-reported
  dependents: number;
  education: '10th' | '12th' | 'graduate' | 'post-graduate' | 'other';
  language: string;                // preferred language
  profileScore: number;            // 0-100, behavioral score
  totalClaims: number;
  totalPayouts: number;
  joinedAt: string;                // ISO date string
  isActive: boolean;
  passwordHash?: string;           // for auth (admin only)
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// ZONE — Geographic area with weather risk data
// ─────────────────────────────────────────────
export interface Zone {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  baseRiskScore: number;           // 0-100 historical risk
  activeWorkers: number;
  avgDailyOrders: number;
  floodProne: boolean;
  heatwaveProne: boolean;
  cycloneProne: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// WEATHER — Current/forecast weather for a zone
// ─────────────────────────────────────────────
export interface Weather {
  id: string;
  zoneId: string;
  temperature: number;             // celsius
  humidity: number;                // percentage
  windSpeed: number;               // km/h
  rainfall: number;                // mm
  condition: 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm' | 'heatwave' | 'cyclone' | 'fog';
  aqi: number;                     // air quality index
  visibility: number;              // km
  feelsLike: number;
  forecast24h: string;             // brief text
  severity: 'none' | 'low' | 'moderate' | 'high' | 'extreme';
  source: string;                  // e.g., "mock_api", "openweather"
  timestamp: string;               // ISO date string
}

// ─────────────────────────────────────────────
// WEATHER EVENT — A triggered weather disruption
// ─────────────────────────────────────────────
export interface WeatherEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  eventType: 'heavy_rain' | 'flood' | 'heatwave' | 'cyclone' | 'storm' | 'fog' | 'air_quality';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  title: string;
  description: string;
  startTime: string;               // ISO date
  endTime?: string;                // ISO date, null if ongoing
  isActive: boolean;
  affectedWorkers: number;
  triggerThreshold: string;        // e.g., "rainfall > 50mm"
  actualValue: string;             // e.g., "rainfall = 72mm"
  autoClaimsTriggered: number;
  createdAt: string;
}

// ─────────────────────────────────────────────
// POLICY — Weekly micro-insurance policy
// ─────────────────────────────────────────────
export interface Policy {
  id: string;
  workerId: string;
  workerName: string;
  zoneId: string;
  zoneName: string;
  weekStart: string;               // ISO date (Monday)
  weekEnd: string;                 // ISO date (Sunday)

  // Coverage details
  coveragePercentage: number;      // e.g., 60 means 60% of daily earnings
  maxDailyPayout: number;          // rupees
  maxWeeklyPayouts: number;        // max days payable in a week
  maxMonthlyPayouts: number;       // max days payable in a month

  // Premium breakdown
  basePremium: number;
  zoneLoading: number;             // additional cost for risky zone
  seasonLoading: number;           // monsoon surcharge etc.
  platformLoading: number;
  behavioralDiscount: number;      // discount for good behavior
  finalPremium: number;            // what the worker actually pays

  status: 'active' | 'expired' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: 'upi' | 'wallet' | 'auto_debit';
  renewalCount: number;            // how many times renewed
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// CLAIM — An insurance claim (auto or manual)
// ─────────────────────────────────────────────
export interface Claim {
  id: string;
  policyId: string;
  workerId: string;
  workerName: string;
  zoneId: string;
  zoneName: string;
  eventId: string;                 // linked weather event
  eventType: string;

  claimDate: string;               // ISO date
  claimType: 'auto' | 'manual';   // auto = system triggered

  // Earnings lost
  estimatedDailyEarnings: number;
  hoursLost: number;
  earningsLost: number;

  // Payout
  coveragePercentage: number;
  calculatedPayout: number;        // earningsLost * coveragePercentage
  approvedPayout: number;          // after fraud check / adjustments
  actualPayout: number;            // what was actually paid

  // Fraud
  fraudScore: number;              // 0-100 (0 = clean, 100 = definite fraud)
  fraudFlags: string[];            // reasons for suspicion

  // Status flow: pending → under_review → approved/denied → paid
  status: 'pending' | 'under_review' | 'approved' | 'denied' | 'paid';
  reviewNote?: string;
  reviewedBy?: string;             // admin who reviewed
  reviewedAt?: string;

  // Payment
  paymentMethod: 'upi' | 'wallet';
  paymentId?: string;              // UPI transaction ID
  paidAt?: string;

  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// PAYMENT — UPI payment record
// ─────────────────────────────────────────────
export interface Payment {
  id: string;
  claimId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  amount: number;
  method: 'upi' | 'wallet';
  upiId?: string;                  // e.g., "amit@paytm"
  transactionId: string;           // mock UPI ref
  status: 'initiated' | 'processing' | 'completed' | 'failed';
  initiatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

// ─────────────────────────────────────────────
// FRAUD ALERT — Flagged suspicious activity
// ─────────────────────────────────────────────
export interface FraudAlert {
  id: string;
  claimId: string;
  workerId: string;
  workerName: string;
  fraudScore: number;
  flags: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// PREMIUM CALCULATION — Result from Person 5's API
// ─────────────────────────────────────────────
export interface PremiumCalculation {
  workerId: string;
  zoneId: string;
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
  riskFactors: {
    zoneRisk: string;
    seasonRisk: string;
    workerRisk: string;
  };
  calculatedAt: string;
}

// ─────────────────────────────────────────────
// ADMIN STATS — Dashboard aggregation
// ─────────────────────────────────────────────
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
  lossRatio: number;               // payouts / premiums
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

// ─────────────────────────────────────────────
// WORKER DASHBOARD — Everything a worker sees
// ─────────────────────────────────────────────
export interface WorkerDashboard {
  worker: Worker;
  activePolicy: Policy | null;
  currentWeather: Weather | null;
  recentClaims: Claim[];
  stats: {
    totalPolicies: number;
    activePolicies: number;
    totalClaims: number;
    totalPayouts: number;
    claimsThisWeek: number;
    claimsThisMonth: number;
  };
}

// ─────────────────────────────────────────────
// AUTH types
// ─────────────────────────────────────────────
export interface AuthToken {
  workerId: string;
  phone: string;
  role: 'worker' | 'admin';
  iat: number;
  exp: number;
}

export interface LoginRequest {
  phone: string;
  otp: string;                     // mock OTP — always "1234"
}

export interface RegisterRequest {
  name: string;
  phone: string;
  city: string;
  platform: Worker['platform'];
  vehicleType: Worker['vehicleType'];
  primaryZoneId: string;
  avgDailyEarnings: number;
  dependents: number;
  education: Worker['education'];
  language: string;
}