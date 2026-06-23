'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, FileText, Map, User, Shield } from 'lucide-react';

const MOCK = {
  worker: { id: 'worker_0001', name: 'Amit Kumar', primaryZoneId: 'zone_003' },
  activePolicy: { id: 'policy_0001', weekStart: '2025-01-13', weekEnd: '2025-01-19', finalPremium: 99, coveragePercentage: 75, maxDailyPayout: 600, maxWeeklyPayouts: 3, maxMonthlyPayouts: 8, status: 'active' },
  currentWeather: { temperature: 32, rainfall: 5, aqi: 145, weatherCondition: 'Partly Cloudy' },
  recentClaims: [
    { id: 'claim_001', claimDate: '2025-01-14', eventType: 'heavy_rain', severityTier: 'T2', approvedPayout: 213, status: 'paid' },
    { id: 'claim_002', claimDate: '2025-01-10', eventType: 'pollution', severityTier: 'T2', approvedPayout: 189, status: 'paid' },
    { id: 'claim_003', claimDate: '2025-01-03', eventType: 'storm', severityTier: 'T3', approvedPayout: 359, status: 'paid' },
  ],
  stats: { totalPayouts: 1247, claimsThisWeek: 1, claimsThisMonth: 2, earningsProtected: 94 }
};

export default function WorkerDashboard() {
  const router = useRouter();
  const [data, setData] = useState(MOCK);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId') || 'worker_0001';
    fetch(`/api/worker/dashboard/${workerId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .catch(() => {});
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      manual_review: 'bg-orange-100 text-orange-800',
      denied: 'bg-red-100 text-red-800',
    };
    return <Badge className={map[status] || map.processing}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-500 text-sm">👋 Hi {data.worker?.name}</p>
            <p className="text-xs text-slate-400">Zone: {data.worker?.primaryZoneId}</p>
          </div>
          <Shield className="text-blue-600" size={28} />
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Policy', value: data.activePolicy ? '✓ Active' : 'None', color: 'text-green-600' },
            { label: 'Claims', value: `${data.stats?.claimsThisWeek || 0}/3 wk`, color: 'text-blue-600' },
            { label: 'Payouts', value: `₹${data.stats?.totalPayouts || 0}`, color: 'text-purple-600' },
            { label: 'Premium', value: `₹${data.activePolicy?.finalPremium || 0}/wk`, color: 'text-slate-800' },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* CURRENT CONDITIONS */}
        <Card className="p-4 mb-4 bg-blue-50 border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-2">CURRENT CONDITIONS</p>
          <div className="flex gap-4 text-sm text-slate-700">
            <span>🌡️ {data.currentWeather?.temperature}°C</span>
            <span>🌧️ {data.currentWeather?.rainfall}mm</span>
            <span>💨 AQI {data.currentWeather?.aqi}</span>
          </div>
          {data.currentWeather?.aqi > 100 && (
            <p className="text-xs text-amber-700 mt-2">⚠ High AQI — covered by your policy!</p>
          )}
        </Card>

        {/* ACTIVE POLICY */}
        {data.activePolicy ? (
          <Card className="p-4 mb-4 border border-green-200 bg-green-50">
            <p className="text-xs font-bold text-green-700 mb-2">ACTIVE POLICY</p>
            <p className="text-sm font-semibold text-slate-800">
              #{data.activePolicy.id}
            </p>
            <p className="text-xs text-slate-500">
              {data.activePolicy.weekStart} → {data.activePolicy.weekEnd}
            </p>
            <div className="flex justify-between mt-2 text-xs text-slate-600">
              <span>Coverage: {data.activePolicy.coveragePercentage}%</span>
              <span>Max: ₹{data.activePolicy.maxDailyPayout}/day</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Claims: {data.stats?.claimsThisWeek}/3 week | {data.stats?.claimsThisMonth}/8 month
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">Renew</Button>
              <Button size="sm" variant="outline" className="text-xs">Details</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-4 border-2 border-dashed border-blue-300 text-center">
            <p className="text-slate-600 mb-3">No active policy yet</p>
            <Link href="/worker/buy-policy">
              <Button className="bg-blue-600 hover:bg-blue-700">Buy Policy Now</Button>
            </Link>
          </Card>
        )}

        {/* RECENT CLAIMS */}
        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-slate-800">Recent Claims</p>
            <Link href="/worker/claims">
              <span className="text-xs text-blue-600 cursor-pointer">View All →</span>
            </Link>
          </div>
          <div className="space-y-2">
            {(data.recentClaims || []).slice(0, 3).map((c: any) => (
              <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-0 text-sm">
                <div>
                  <p className="font-semibold capitalize text-slate-700">
                    {c.eventType.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-slate-400">{c.claimDate} · {c.severityTier}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{c.approvedPayout}</p>
                  {statusBadge(c.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* EARNINGS PROTECTION */}
        <Card className="p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Earnings Protection</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Normal income:</span>
              <span className="font-semibold">₹16,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lost to events:</span>
              <span className="font-semibold text-red-500">-₹2,250</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GigShield payouts:</span>
              <span className="font-semibold text-green-600">+₹{data.stats?.totalPayouts}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Protected</span>
              <span>{data.stats?.earningsProtected}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${data.stats?.earningsProtected || 0}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around max-w-md mx-auto">
        {[
          { icon: Home, label: 'Home', href: '/worker/dashboard', active: true },
          { icon: FileText, label: 'Claims', href: '/worker/claims', active: false },
          { icon: Map, label: 'Map', href: '/admin/map', active: false },
          { icon: User, label: 'Profile', href: '/worker/profile', active: false },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <div className={`flex flex-col items-center gap-1 ${item.active ? 'text-blue-600' : 'text-slate-400'}`}>
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}