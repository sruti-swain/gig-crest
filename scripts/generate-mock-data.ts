import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/* ===========================
   ZONES (aligned with Zone type)
=========================== */

const zones = [
  { id: 'zone_001', name: 'Andheri East', city: 'Mumbai', coordinates: { lat: 19.1136, lng: 72.8697 }, radius: 3000, basePremiumFactor: 1.25, riskLevel: 'medium' },
  { id: 'zone_002', name: 'Andheri West', city: 'Mumbai', coordinates: { lat: 19.1354, lng: 72.8267 }, radius: 3000, basePremiumFactor: 1.15, riskLevel: 'medium' },
  { id: 'zone_003', name: 'Bandra', city: 'Mumbai', coordinates: { lat: 19.0596, lng: 72.8295 }, radius: 2500, basePremiumFactor: 1.35, riskLevel: 'high' },
  { id: 'zone_004', name: 'Powai', city: 'Mumbai', coordinates: { lat: 19.1176, lng: 72.906 }, radius: 3500, basePremiumFactor: 1.10, riskLevel: 'low' },

  { id: 'zone_008', name: 'Connaught Place', city: 'Delhi', coordinates: { lat: 28.6315, lng: 77.2167 }, radius: 2000, basePremiumFactor: 1.45, riskLevel: 'high' },
  { id: 'zone_009', name: 'Rohini', city: 'Delhi', coordinates: { lat: 28.7499, lng: 77.0656 }, radius: 4000, basePremiumFactor: 1.30, riskLevel: 'high' },

  { id: 'zone_014', name: 'Koramangala', city: 'Bangalore', coordinates: { lat: 12.9352, lng: 77.6245 }, radius: 3000, basePremiumFactor: 1.28, riskLevel: 'medium' },
  { id: 'zone_015', name: 'Indiranagar', city: 'Bangalore', coordinates: { lat: 12.9784, lng: 77.6408 }, radius: 2800, basePremiumFactor: 1.32, riskLevel: 'high' }
];

/* ===========================
   WORKERS (aligned with Worker type)
=========================== */

const generateWorkers = () => {
  const workers = [];

  for (let i = 1; i <= 50; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];

    workers.push({
      id: `worker_${String(i).padStart(4, '0')}`,
      name: `Worker ${i}`,
      phone: `9${String(8000000000 + i).slice(1)}`,
      city: zone.city,
      primaryZoneId: zone.id,
      deliveryPlatform: 'swiggy',
      vehicleType: 'bike',
      avgDailyEarning: 500 + Math.floor(Math.random() * 500),
      hoursPerDay: 8,
      daysPerWeek: 6,
      experienceMonths: 12,
      upiId: `worker${i}@upi`,
      createdAt: new Date().toISOString(),
      isActive: true
    });
  }

  return workers;
};

/* ===========================
   POLICIES
=========================== */

const generatePolicies = (workers: any[]) => {
  return workers.slice(0, 20).map((worker: any, index: number) => ({
    id: `policy_${String(index + 1).padStart(4, '0')}`,
    workerId: worker.id,
    weekStart: new Date().toISOString(),
    weekEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    coveragePercentage: 75,
    maxDailyPayout: 600,
    maxWeeklyPayouts: 3,
    maxMonthlyPayouts: 8,
    basePremium: 99,
    zoneLoading: 20,
    seasonLoading: 15,
    platformLoading: 10,
    behavioralDiscount: 5,
    finalPremium: 139,
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString()
  }));
};

/* ===========================
   CLAIMS
=========================== */

const generateClaims = (policies: any[], workers: any[]) => {
  return policies.slice(0, 10).map((policy: any, index: number) => {
    const worker = workers.find(w => w.id === policy.workerId);

    return {
      id: `claim_${String(index + 1).padStart(4, '0')}`,
      policyId: policy.id,
      workerId: worker.id,
      workerName: worker.name,
      eventId: `event_${String(index + 1).padStart(4, '0')}`,
      claimDate: new Date().toISOString().split('T')[0],
      eventType: 'rain',
      severityTier: 'T2',
      dailyEarningBasis: worker.avgDailyEarning,
      coveragePercentage: 75,
      severityFactor: 0.6,
      hoursAffected: 4,
      hoursRatio: 0.5,
      calculatedPayout: 300,
      approvedPayout: 300,
      fraudScore: 15,
      fraudFlags: [],
      status: 'paid',
      paymentStatus: 'completed',
      paymentId: `TXN_${Date.now()}`,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  });
};

/* ===========================
   EVENTS
=========================== */

const generateEvents = () => {
  return [
    {
      id: 'event_0001',
      eventType: 'rain',
      severityTier: 'T2',
      severityFactor: 0.6,
      zoneId: zones[0].id,
      zoneName: zones[0].name,
      city: zones[0].city,
      eventStart: new Date().toISOString(),
      eventEnd: null,
      durationHours: 4,
      measurements: {
        rainfall: 40
      },
      isVerified: true,
      claimsGenerated: 5,
      totalPayoutAmount: 1500,
      createdAt: new Date().toISOString()
    }
  ];
};

/* ===========================
   WEATHER
=========================== */

const generateWeather = () => {
  return zones.map(zone => ({
    zoneId: zone.id,
    temperature: 28,
    rainfall: 5,
    aqi: 120,
    windSpeed: 10,
    visibility: 6,
    timestamp: new Date().toISOString(),
    source: 'simulation' as const
  }));
};

/* ===========================
   INIT
=========================== */

const initializeData = () => {
  const workers = generateWorkers();
  const policies = generatePolicies(workers);
  const claims = generateClaims(policies, workers);
  const events = generateEvents();
  const weather = generateWeather();

  fs.writeFileSync(path.join(DATA_DIR, 'zones.json'), JSON.stringify(zones, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'workers.json'), JSON.stringify(workers, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'policies.json'), JSON.stringify(policies, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'claims.json'), JSON.stringify(claims, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify(events, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'weather.json'), JSON.stringify(weather, null, 2));

  console.log('✅ Mock data initialized successfully!');
};

if (require.main === module) {
  initializeData();
}

export { initializeData };