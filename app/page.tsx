'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Zap, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={28} />
            <span className="text-xl font-bold text-slate-800">GigShield</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/worker/login">
              <Button variant="ghost" className="font-semibold">
                Worker Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" className="border-blue-600 text-blue-600 font-semibold">
                Admin Portal
              </Button>
            </Link>
            <Link href="/worker/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/40 rounded-full px-4 py-1 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Parametric Insurance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Earn with confidence.<br />Rain or shine.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            GigShield automatically detects disruptions and pays you instantly —
            no claims to file, no waiting, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/worker/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold h-14 px-8 text-lg w-full sm:w-auto">
                Register Now <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/worker/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 font-bold h-14 px-8 text-lg w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* KEY STATS */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-600">7.7M+</p>
            <p className="text-slate-500 text-sm mt-1">Gig Workers Protected</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-600">₹99/wk</p>
            <p className="text-slate-500 text-sm mt-1">Starting Premium</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-600">&lt;1 hr</p>
            <p className="text-slate-500 text-sm mt-1">Payout Time</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">
            How GigShield Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Register', desc: 'Create your account in 2 minutes. Enter your earnings and zone.', icon: '📝' },
              { step: '2', title: 'Buy Policy', desc: 'Pay ₹99/week. Get covered for rain, flood, heat, AQI, strikes.', icon: '🛡️' },
              { step: '3', title: 'Get Protected', desc: 'We auto-detect disruptions and pay you instantly via UPI.', icon: '💰' },
            ].map((item) => (
              <Card key={item.step} className="p-6 text-center border-none shadow-md bg-white">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">
            Why Choose GigShield?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-none shadow-md">
              <Zap className="text-blue-600 mb-3" size={32} />
              <h3 className="font-bold text-slate-800 mb-2">Instant Payouts</h3>
              <p className="text-slate-500 text-sm">
                Money hits your UPI account automatically the moment a disruption is detected.
              </p>
            </Card>
            <Card className="p-6 border-none shadow-md">
              <Shield className="text-green-600 mb-3" size={32} />
              <h3 className="font-bold text-slate-800 mb-2">AI Protection</h3>
              <p className="text-slate-500 text-sm">
                Our AI monitors weather, AQI, and civil events 24/7 across all zones.
              </p>
            </Card>
            <Card className="p-6 border-none shadow-md">
              <Clock className="text-amber-600 mb-3" size={32} />
              <h3 className="font-bold text-slate-800 mb-2">Full Coverage</h3>
              <p className="text-slate-500 text-sm">
                Rain ✓ Flood ✓ Extreme Heat ✓ Poor AQI ✓ Strike ✓ Curfew ✓
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">
          Ready to protect your income?
        </h2>
        <p className="text-blue-100 mb-8">
          Join thousands of delivery workers who never worry about bad weather again.
        </p>
        <Link href="/worker/register">
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold h-14 px-10 text-lg">
            Get Started — It&apos;s Free to Try
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-slate-400 py-8 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="text-blue-400" size={20} />
          <span className="text-white font-bold">GigShield</span>
        </div>
        <p>© {new Date().getFullYear()} GigShield. AI Parametric Insurance for Gig Workers.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link href="/worker/login" className="hover:text-white">Worker Login</Link>
          <Link href="/admin/login" className="hover:text-white">Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
}