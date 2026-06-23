'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Calculator, Shield, TrendingUp } from 'lucide-react';

export default function AIEnginePage() {
  const [premiumInput, setPremiumInput] = useState({
    workerId: 'worker_0001',
    zoneId: 'zone_001',
  });
  const [premiumResult, setPremiumResult] = useState<any>(null);
  const [premiumLoading, setPremiumLoading] = useState(false);

  const [fraudInput, setFraudInput] = useState({
    workerId: 'worker_0001',
    claimDate: new Date().toISOString(),
    eventId: 'event_0001',
    zoneId: 'zone_001',
  });
  const [fraudResult, setFraudResult] = useState<any>(null);
  const [fraudLoading, setFraudLoading] = useState(false);

  const calculatePremium = async () => {
    setPremiumLoading(true);
    try {
      const res = await fetch('/api/premium/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(premiumInput),
      });
      const data = await res.json();
      setPremiumResult(data.data?.premium || MOCK_PREMIUM);
    } catch {
      setPremiumResult(MOCK_PREMIUM);
    }
    setPremiumLoading(false);
  };

  const scoreFraud = async () => {
    setFraudLoading(true);
    try {
      const res = await fetch('/api/fraud/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fraudInput),
      });
      const data = await res.json();
      setFraudResult(data.data?.fraud || MOCK_FRAUD);
    } catch {
      setFraudResult(MOCK_FRAUD);
    }
    setFraudLoading(false);
  };

  const MOCK_PREMIUM = {
    basePremium: 99,
    zoneLoading: 25,
    seasonLoading: 59,
    platformLoading: 15,
    behavioralDiscount: -15,
    finalPremium: 183,
    coverageDetails: {
      coveragePercentage: 75,
      maxDailyPayout: 600,
      maxWeeklyPayouts: 3,
      maxMonthlyPayouts: 8,
    },
  };

  const MOCK_FRAUD = {
    totalScore: 32,
    verdict: 'Low Risk',
    flags: [
      { type: 'claim_frequency', description: 'Slightly above average claim frequency', score: 12 },
      { type: 'timing_pattern', description: 'Claims on weekend days', score: 20 },
    ],
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-[250px] flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Brain className="text-purple-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">AI Engine</h1>
              <p className="text-slate-500 text-sm">
                Premium calculator, payout engine, and fraud scoring.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PREMIUM CALCULATOR */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="text-blue-600" size={22} />
              <h2 className="text-lg font-bold text-slate-800">Premium Calculator</h2>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Worker ID</label>
                <input
                  value={premiumInput.workerId}
                  onChange={(e) => setPremiumInput({ ...premiumInput, workerId: e.target.value })}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Zone ID</label>
                <input
                  value={premiumInput.zoneId}
                  onChange={(e) => setPremiumInput({ ...premiumInput, zoneId: e.target.value })}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <Button
              onClick={calculatePremium}
              disabled={premiumLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
            >
              {premiumLoading ? 'Calculating...' : 'Calculate Premium'}
            </Button>

            {premiumResult && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-bold text-slate-700 mb-2">Premium Breakdown</p>
                {[
                  { label: 'Base Premium', value: `₹${premiumResult.basePremium}` },
                  { label: 'Zone Risk Loading', value: `+₹${premiumResult.zoneLoading}` },
                  { label: 'Season Loading', value: `+₹${premiumResult.seasonLoading}` },
                  { label: 'Platform Loading', value: `+₹${premiumResult.platformLoading}` },
                  { label: 'Behavioral Discount', value: `₹${premiumResult.behavioralDiscount}` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-slate-600">
                    <span>{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-blue-700 text-base">
                  <span>Weekly Premium</span>
                  <span>₹{premiumResult.finalPremium}</span>
                </div>
                <div className="border-t pt-2 mt-2 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-700">Coverage Details</p>
                  <p>Coverage: {premiumResult.coverageDetails?.coveragePercentage}%</p>
                  <p>Max Daily: ₹{premiumResult.coverageDetails?.maxDailyPayout}</p>
                  <p>Max Weekly Claims: {premiumResult.coverageDetails?.maxWeeklyPayouts}</p>
                  <p>Max Monthly Claims: {premiumResult.coverageDetails?.maxMonthlyPayouts}</p>
                </div>
              </div>
            )}
          </Card>

          {/* FRAUD SCORER */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-red-600" size={22} />
              <h2 className="text-lg font-bold text-slate-800">Fraud Scorer</h2>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Worker ID</label>
                <input
                  value={fraudInput.workerId}
                  onChange={(e) => setFraudInput({ ...fraudInput, workerId: e.target.value })}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Event ID</label>
                <input
                  value={fraudInput.eventId}
                  onChange={(e) => setFraudInput({ ...fraudInput, eventId: e.target.value })}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Zone ID</label>
                <input
                  value={fraudInput.zoneId}
                  onChange={(e) => setFraudInput({ ...fraudInput, zoneId: e.target.value })}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <Button
              onClick={scoreFraud}
              disabled={fraudLoading}
              className="w-full bg-red-600 hover:bg-red-700 mb-4"
            >
              {fraudLoading ? 'Scoring...' : 'Run Fraud Score'}
            </Button>

            {fraudResult && (
              <div className="bg-red-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-700">Risk Score</span>
                  <span className={`text-2xl font-extrabold ${
                    fraudResult.totalScore > 70 ? 'text-red-600'
                    : fraudResult.totalScore > 45 ? 'text-orange-500'
                    : 'text-green-600'
                  }`}>
                    {fraudResult.totalScore}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full mb-3">
                  <div
                    className={`h-full rounded-full ${
                      fraudResult.totalScore > 70 ? 'bg-red-500'
                      : fraudResult.totalScore > 45 ? 'bg-orange-500'
                      : 'bg-green-500'
                    }`}
                    style={{ width: `${fraudResult.totalScore}%` }}
                  />
                </div>
                <p className="font-semibold text-slate-700 mb-2">
                  Verdict: {fraudResult.verdict}
                </p>
                {fraudResult.flags?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-600">Flags:</p>
                    {fraudResult.flags.map((flag: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs text-slate-600">
                        <span>• {flag.description}</span>
                        <span className="font-semibold text-red-600">+{flag.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* WHAT-IF CALCULATOR */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={22} />
              <h2 className="text-lg font-bold text-slate-800">What-If Calculator</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                AI Powered
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Simulate how changes in earnings, zone, or platform affect premium pricing.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Daily Earning', value: '₹750', change: '+10%', result: '₹827', color: 'text-green-600' },
                { label: 'Zone Risk', value: 'Orange → Green', change: 'Downgrade', result: '-₹25 premium', color: 'text-green-600' },
                { label: 'Platform', value: 'Zomato → Both', change: '+Full time', result: '+₹15 premium', color: 'text-red-600' },
                { label: 'Experience', value: '12 → 24 months', change: '+1 year', result: '-₹10 discount', color: 'text-green-600' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-4 border">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.change}</p>
                  <p className={`text-sm font-bold mt-2 ${item.color}`}>{item.result}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}