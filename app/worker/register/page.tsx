'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function WorkerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', phone: '', city: 'Mumbai', zone: 'zone_001',
    platform: 'zomato', vehicle: 'bike',
    avgDailyEarning: 750, hoursPerDay: 8, daysPerWeek: 6,
    experienceMonths: 12, upiId: ''
  });

  const zones: Record<string, string[]> = {
    Mumbai: ['Andheri East', 'Bandra West', 'Powai', 'Kurla'],
    Delhi: ['Connaught Place', 'Rohini', 'Dwarka', 'Lajpat Nagar'],
    Bangalore: ['Koramangala', 'Indiranagar', 'Bellandur', 'Whitefield'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('workerId', data.data?.worker?.id || 'worker_0001');
        router.push('/worker/dashboard');
      }
    } catch {
      // Mock mode fallback
      localStorage.setItem('workerId', 'worker_0001');
      router.push('/worker/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-lg mx-auto p-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-blue-600" size={28} />
          <span className="text-xl font-bold">GigShield</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-slate-500 text-sm mb-6">Join GigShield and protect your income.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Amit Kumar' },
            { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '9876543210' },
            { label: 'UPI ID', key: 'upiId', type: 'text', placeholder: 'amit@upi' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm font-semibold text-slate-700">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-semibold text-slate-700">City</label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            >
              {['Mumbai', 'Delhi', 'Bangalore'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Primary Zone</label>
            <select
              value={form.zone}
              onChange={(e) => setForm({ ...form, zone: e.target.value })}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            >
              {(zones[form.city] || []).map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Platform</label>
            <div className="flex gap-3 mt-1">
              {['swiggy', 'zomato', 'both', 'other'].map((p) => (
                <label key={p} className="flex items-center gap-1 text-sm capitalize cursor-pointer">
                  <input type="radio" name="platform" value={p} checked={form.platform === p}
                    onChange={() => setForm({ ...form, platform: p })} />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Vehicle Type</label>
            <div className="flex gap-3 mt-1">
              {['bike', 'bicycle', 'e-bike'].map((v) => (
                <label key={v} className="flex items-center gap-1 text-sm capitalize cursor-pointer">
                  <input type="radio" name="vehicle" value={v} checked={form.vehicle === v}
                    onChange={() => setForm({ ...form, vehicle: v })} />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {[
            { label: 'Avg Daily Earning (₹)', key: 'avgDailyEarning', min: 200, max: 2000 },
            { label: 'Hours Per Day', key: 'hoursPerDay', min: 2, max: 16 },
            { label: 'Days Per Week', key: 'daysPerWeek', min: 1, max: 7 },
            { label: 'Experience (months)', key: 'experienceMonths', min: 1, max: 120 },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-slate-700">{f.label}</label>
              <input
                type="number" min={f.min} max={f.max}
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>
          ))}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link href="/worker/login" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </Card>
    </div>
  );
}