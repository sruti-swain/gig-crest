'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials from PDF
    if (email === 'admin@gigshield.in' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@gigshield.in / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="text-blue-600" size={28} />
          <div>
            <p className="font-bold text-slate-800">GigShield</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gigshield.in"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-semibold">
            Login to Admin Panel
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Not an admin?{' '}
          <Link href="/worker/login" className="text-blue-600 font-semibold">Worker Login</Link>
        </p>
      </Card>
    </div>
  );
}