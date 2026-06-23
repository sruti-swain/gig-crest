// Static mock data extracted from original Gig.ts
// These will later be replaced with API calls to your backend

export const workerData = {
  totalEarnings: '₹14,230',
  coverageStatus: 'Active',
  totalClaims: 4,
  protectionPercent: 83,
  currentWeather: 'Rain',
  riskLevel: 'Medium',
  activePlan: {
    type: 'Weekly Premium',
    premium: '₹49',
    coverage: '₹5,500',
    validUntil: '31 Dec 2026'
  },
  recentClaims: [
    { id: 'CLM001', event: 'Heavy Rain', amount: '₹1,800', status: 'Approved' },
    { id: 'CLM002', event: 'Heatwave', amount: '₹1,200', status: 'Processing' },
    { id: 'CLM003', event: 'Poor AQI', amount: '₹1,000', status: 'Approved' }
  ],
  incomeProtection: {
    totalLost: '₹4,340',
    recovered: '₹3,506',
    protectionRate: 80.8
  }
};

export const adminData = {
  totalWorkers: 2700,
  activePolicies: 2100,
  totalClaims: 556,
  totalPayouts: '₹18.2k',
  fraudAlerts: 217,
  liveEvents: [
    { zone: 'Zone A', event: 'Heavy Rain', severity: 'T3', workers: 479 },
    { zone: 'Zone B', event: 'Heatwave', severity: 'T2', workers: 295 },
    { zone: 'Zone C', event: 'Poor AQI', severity: 'T4', workers: 550 }
  ],
  claimsToday: {
    total: 58,
    approved: 18,
    pending: 20,
    rejected: 20
  },
  fraudulentClaims: [
    { id: 'CLM9876', worker: 'Worker #1234', risk: 85, reason: 'GPS Mismatch' },
    { id: 'CLM9877', worker: 'Worker #5678', risk: 72, reason: 'Duplicate Claim' },
    { id: 'CLM9878', worker: 'Worker #9012', risk: 68, reason: 'Abnormal Pattern' }
  ]
};

export const faqData = [
  {
    question: "What is GigCrest and how does it work?",
    answer: "GigCrest is a weather-based parametric insurance platform designed specifically for gig economy workers. When adverse weather conditions like heavy rain, extreme heat, or poor air quality affect your ability to work, our system automatically detects it and processes your claim within an hour."
  },
  {
    question: "How much does GigCrest coverage cost?",
    answer: "Our plans start at just ₹99 per week, which provides coverage up to ₹50,000. We also offer monthly plans at ₹349 with enhanced coverage up to ₹2,00,000. The premium is automatically deducted from your gig platform earnings."
  },
  {
    question: "How quickly will I receive my payout?",
    answer: "Once an eligible weather event is detected and verified through our automated system, payouts are processed within 1 hour directly to your linked bank account or UPI. No paperwork or manual claims needed!"
  },
  {
    question: "What weather events are covered under GigCrest?",
    answer: "We cover heavy rainfall (above 50mm), extreme heat (above 42°C), poor air quality (AQI above 300), flooding, cyclones, and other severe weather conditions that impact outdoor work. Coverage varies by plan tier."
  },
  {
    question: "Can I use GigCrest if I work for multiple gig platforms?",
    answer: "Absolutely! GigCrest works across all major gig platforms including Swiggy, Zomato, Uber, Ola, Dunzo, and more. One subscription covers your work across all platforms."
  }
];

export const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Swiggy Delivery Partner",
    rating: 5,
    text: "Last monsoon, I lost almost ₹15,000 due to heavy rains. With GigCrest, I recovered 85% of my lost income automatically. The payout came within 45 minutes!",
    avatar: "RK"
  },
  {
    name: "Priya Sharma",
    role: "Blinkit Delivery Partner",
    rating: 5,
    text: "The heatwave in May made it impossible to work during peak hours. GigCrest covered my losses without me having to file any paperwork. Truly automated!",
    avatar: "PS"
  },
  {
    name: "Mohammed Irfan",
    role: "Zomato Delivery Partner",
    rating: 5,
    text: "I was skeptical at first, but when I received ₹1,500 during the Delhi AQI crisis, I became a believer. Every gig worker needs this protection.",
    avatar: "MI"
  }
];

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' }
];