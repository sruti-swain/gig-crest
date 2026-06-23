'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Check, Loader2 } from 'lucide-react';
import type { PremiumBreakdown } from '@/types';

interface BuyPolicyFormProps {
  workerId: string;
  zoneId: string;
  onSuccess: () => void;
}

export const BuyPolicyForm: React.FC<BuyPolicyFormProps> = ({
  workerId,
  zoneId,
  onSuccess
}) => {
  const [premium, setPremium] = useState<PremiumBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [step, setStep] = useState<'calculate' | 'confirm' | 'payment'>('calculate');

  useEffect(() => {
    if (workerId && zoneId) {
      fetchPremium();
    }
  }, [workerId, zoneId]);

  const fetchPremium = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/premium/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, zoneId })
      });

      const data = await response.json();

      if (data.success && data.data?.premium) {
        setPremium(data.data.premium);
        setStep('confirm');
      } else {
        alert('Failed to calculate premium: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Premium calculation error:', error);
      alert('Failed to calculate premium. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setStep('payment');

      // mock payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, zoneId })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        alert('Failed to create policy: ' + (data.error || 'Unknown error'));
        setStep('confirm');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to complete purchase. Please try again.');
      setStep('confirm');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
          <p className="text-sm text-gray-600">Calculating your premium...</p>
        </div>
      </Card>
    );
  }

  if (!premium) {
    return (
      <Card className="p-6">
        <p className="text-center text-red-600">Failed to load premium details</p>
        <Button onClick={fetchPremium} className="w-full mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Shield size={40} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Please complete payment in your UPI app
          </p>
          <div className="w-full max-w-xs p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Amount to Pay</p>
              <p className="text-2xl font-bold text-gray-900">₹{premium.finalPremium}</p>
              <p className="text-xs text-gray-500 mt-2">Simulating UPI payment...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Premium Breakdown */}
      <Card className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">Premium Breakdown</h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Base Premium</span>
            <span className="text-sm font-semibold text-gray-900">₹{premium.basePremium}</span>
          </div>

          {(premium.zoneLoading ?? 0) > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Zone Risk Loading</span>
              <span className="text-sm font-semibold text-orange-600">
                +₹{premium.zoneLoading}
              </span>
            </div>
          )}

          {(premium.seasonLoading ?? 0) > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Season Loading</span>
              <span className="text-sm font-semibold text-orange-600">
                +₹{premium.seasonLoading}
              </span>
            </div>
          )}

          {(premium.platformLoading ?? 0) > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Platform Loading</span>
              <span className="text-sm font-semibold text-orange-600">
                +₹{premium.platformLoading}
              </span>
            </div>
          )}

          {(premium.behavioralDiscount ?? 0) > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Good Behavior Discount</span>
              <span className="text-sm font-semibold text-green-600">
                -₹{premium.behavioralDiscount}
              </span>
            </div>
          )}

          <div className="border-t-2 border-gray-200 pt-3 mt-3 flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Weekly Premium</span>
            <span className="text-xl font-bold text-blue-600">₹{premium.finalPremium}</span>
          </div>

          <div className="text-center">
            <span className="text-xs text-gray-500">
              (₹{(premium.finalPremium / 7).toFixed(2)} per day)
            </span>
          </div>
        </div>
      </Card>

      {/* Coverage Details */}
      <Card className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">Coverage Details</h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Coverage %</div>
            <div className="text-xl font-bold text-blue-600">
              {premium.coverageDetails.coveragePercentage}%
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Max/Day</div>
            <div className="text-xl font-bold text-green-600">
              ₹{premium.coverageDetails.maxDailyPayout}
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Max/Week</div>
            <div className="text-xl font-bold text-purple-600">
              {premium.coverageDetails.maxWeeklyPayouts} claims
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Max/Month</div>
            <div className="text-xl font-bold text-orange-600">
              {premium.coverageDetails.maxMonthlyPayouts} claims
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs font-semibold text-gray-700 mb-2">Covered Events</div>
          <div className="flex flex-wrap gap-2">
            {['Rain', 'Flood', 'Heat', 'AQI', 'Strike', 'Curfew'].map((event) => (
              <div
                key={event}
                className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-md border border-gray-200"
              >
                <Check size={12} className="text-green-600" />
                <span className="text-gray-700">{event}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Purchase Button */}
      <Button
        type="button"
        onClick={handlePurchase}
        disabled={purchasing}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg"
      >
        {purchasing ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>Pay ₹{premium.finalPremium} via UPI</>
        )}
      </Button>
    </div>
  );
};

export default BuyPolicyForm;