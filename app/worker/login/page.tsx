'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function WorkerLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerify = () => {
    // Mock: accept "1234" as valid OTP always
    if (otp === '1234') {
      localStorage.setItem('workerId', 'worker_0001');
      router.push('/worker/dashboard');
    } else {
      alert('Invalid OTP. Use 1234 for demo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="text-blue-600" size={28} />
          <span className="text-xl font-bold">GigShield</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Worker Login</h1>
        <p className="text-slate-500 text-sm mb-6">
          Enter your phone number to receive an OTP.
        </p>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <div className="flex mt-1">
                <span className="border border-r-0 rounded-l-md px-3 flex items-center bg-slate-100 text-slate-600 text-sm">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="flex-1 border rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button onClick={handleSendOtp} className="w-full bg-blue-600 hover:bg-blue-700">
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">OTP sent to +91 {phone}</p>
            <div>
              <label className="text-sm font-semibold text-slate-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP (use 1234)"
                maxLength={4}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={handleVerify} className="w-full bg-blue-600 hover:bg-blue-700">
              Verify &amp; Login
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          No account?{' '}
          <Link href="/worker/register" className="text-blue-600 font-semibold">Register here</Link>
        </p>
        <p className="text-center text-sm text-slate-500 mt-2">
          Admin?{' '}
          <Link href="/admin/login" className="text-blue-600 font-semibold">Admin Portal</Link>
        </p>
      </Card>
    </div>
  );
}