'use client';

import dynamic from 'next/dynamic';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export type Worker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle';
  zone: string;
  platform: string;
};

// ✅ FIXED dynamic import (NO .then)
const LiveMap = dynamic(
  () => import('@/components/maps/LiveTrackingMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-100 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading live tracking...</p>
        </div>
      </div>
    ),
  }
);

export default function LiveTrackingPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ API fetch
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch('/api/workers');
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setWorkers(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load worker data');
      }
    };

    fetchWorkers();
    const interval = setInterval(fetchWorkers, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = workers.filter((w) => w.status === 'active').length;
  const idleCount = workers.length - activeCount;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="ml-[250px] flex-1 p-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-green-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Live GPS Tracking
              </h1>
              <p className="text-slate-500 text-sm">
                Real-time worker locations · Auto-updates every 5 seconds
              </p>
            </div>
          </div>

          {mounted && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <Card className="p-3 mb-4 text-red-600 bg-red-50">
            {error}
          </Card>
        )}

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            <p className="text-xs text-slate-500">Active</p>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{idleCount}</p>
            <p className="text-xs text-slate-500">Idle</p>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{workers.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </Card>
        </div>

        {/* MAP + LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[520px] bg-white rounded-xl border overflow-hidden">
            <LiveMap workers={workers} />
          </div>

          <Card className="p-4 overflow-y-auto max-h-[520px]">
            <p className="text-sm font-bold mb-3">
              Workers ({workers.length})
            </p>

            {workers.map((w) => (
              <div key={w.id} className="p-2 border rounded mb-2 text-xs">
                <p className="font-semibold">{w.name}</p>
                <p>{w.zone}</p>
                <Badge>{w.status}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </main>
    </div>
  );
}