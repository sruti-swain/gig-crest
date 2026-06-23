// components/admin/LossRatioGauge.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface LossRatioGaugeProps {
  lossRatio: number;
  premiums: number;
  payouts: number;
}

export const LossRatioGauge: React.FC<LossRatioGaugeProps> = ({ 
  lossRatio, 
  premiums, 
  payouts 
}) => {
  const getStatusConfig = (ratio: number) => {
    if (ratio < 40) return { 
      color: 'text-green-600', 
      bg: 'bg-green-500', 
      label: 'Excellent', 
      icon: TrendingUp 
    };
    if (ratio < 60) return { 
      color: 'text-blue-600', 
      bg: 'bg-blue-500', 
      label: 'Good', 
      icon: TrendingUp 
    };
    if (ratio < 80) return { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-500', 
      label: 'Moderate', 
      icon: AlertCircle 
    };
    return { 
      color: 'text-red-600', 
      bg: 'bg-red-500', 
      label: 'High Risk', 
      icon: TrendingDown 
    };
  };

  const status = getStatusConfig(lossRatio);
  const StatusIcon = status.icon;

  // Calculate angle for gauge (180 degrees = 0-100%)
  const angle = Math.min((lossRatio / 100) * 180, 180);

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6 text-center">Loss Ratio</h3>

      {/* Gauge Visualization */}
      <div className="relative w-48 h-24 mx-auto mb-6">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Colored Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke={status.bg.replace('bg-', '#')}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 251} 251`}
            className="transition-all duration-1000"
          />
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${status.color}`}>
            {lossRatio.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 mt-1">
            <StatusIcon size={14} className={status.color} />
            <span className={`text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-600 mb-1">Premiums</div>
          <div className="text-lg font-bold text-blue-600">
            ₹{(premiums / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-600 mb-1">Payouts</div>
          <div className="text-lg font-bold text-red-600">
            ₹{(payouts / 1000).toFixed(1)}K
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Target:</span> Keep loss ratio below 60% for sustainable operations. 
            {lossRatio < 60 ? ' ✓ Currently on track!' : ' ⚠ Review pricing or fraud detection.'}
          </p>
        </div>
      </div>
    </Card>
  );
};