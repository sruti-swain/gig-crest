'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { Policy } from '@/types';

interface PremiumBreakdownCardProps {
  policy: Policy;
}

export const PremiumBreakdownCard: React.FC<PremiumBreakdownCardProps> = ({ policy }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Info size={18} className="text-blue-600" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-gray-900">Premium Breakdown</h4>
            <p className="text-xs text-gray-500">See how your premium is calculated</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Base Premium</span>
              <span className="text-sm font-semibold text-gray-900">₹{policy.basePremium}</span>
            </div>

            {(policy.zoneLoading ?? 0) > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-600">Zone Risk Loading</span>
                  <p className="text-xs text-gray-400">Based on your delivery area</p>
                </div>
                <span className="text-sm font-semibold text-orange-600">
                  +₹{policy.zoneLoading ?? 0}
                </span>
              </div>
            )}

            {(policy.seasonLoading ?? 0) > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-600">Season Loading</span>
                  <p className="text-xs text-gray-400">Monsoon/summer adjustment</p>
                </div>
                <span className="text-sm font-semibold text-orange-600">
                  +₹{policy.seasonLoading ?? 0}
                </span>
              </div>
            )}

            {(policy.platformLoading ?? 0) > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-600">Platform Loading</span>
                  <p className="text-xs text-gray-400">Full-time worker rate</p>
                </div>
                <span className="text-sm font-semibold text-orange-600">
                  +₹{policy.platformLoading ?? 0}
                </span>
              </div>
            )}

            {(policy.behavioralDiscount ?? 0) > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-600">Good Behavior Discount 🎉</span>
                  <p className="text-xs text-gray-400">Clean claims history</p>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  -₹{policy.behavioralDiscount ?? 0}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 mt-2">
              <span className="text-base font-bold text-gray-900">Final Weekly Premium</span>
              <span className="text-xl font-bold text-blue-600">₹{policy.finalPremium}</span>
            </div>

            <div className="text-center text-xs text-gray-500">
              (₹{(policy.finalPremium / 7).toFixed(2)} per day)
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};