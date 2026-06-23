// components/worker/PaymentSuccessModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Calendar, DollarSign, Award } from 'lucide-react';

interface PaymentSuccessModalProps {
  show: boolean;
  amount: number;
  policyId: string;
  weekStart: string;
  weekEnd: string;
  onClose: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  show,
  amount,
  policyId,
  weekStart,
  weekEnd,
  onClose
}) => {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [show]);

  if (!show) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 relative overflow-hidden">
        {confetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle size={40} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          
          <p className="text-sm text-gray-600 mb-6">
            Your policy is now active and you're protected
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield size={24} className="text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Policy Activated</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="text-xs text-gray-600">Amount Paid</span>
                </div>
                <span className="text-lg font-bold text-green-600">₹{amount}</span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Valid Period</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">
                  {formatDate(weekStart)} - {formatDate(weekEnd)}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Policy ID</div>
                <div className="text-xs font-mono font-bold text-gray-900">{policyId}</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <Award size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-900 text-left">
                <span className="font-semibold">You're now protected!</span> If weather disrupts your work, 
                we'll automatically detect it and process your payout within 1 hour.
              </p>
            </div>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};