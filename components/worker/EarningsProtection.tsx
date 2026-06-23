// components/worker/EarningsProtection.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface EarningsProtectionProps {
  totalLost: number;
  recovered: number;
  protectionRate: number;
}

export const EarningsProtection: React.FC<EarningsProtectionProps> = ({
  totalLost,
  recovered,
  protectionRate
}) => {
  const normalIncome = totalLost + (totalLost * 0.2); // Estimate

  return (
    <Card className="p-5 mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Shield size={18} className="text-blue-600" />
        Income Protection Tracker
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Normal Income</div>
          <div className="text-base font-bold text-gray-900">₹{Math.round(normalIncome).toLocaleString()}</div>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <TrendingDown size={14} className="mx-auto mb-1 text-red-600" />
          <div className="text-xs text-gray-500 mb-1">Lost</div>
          <div className="text-base font-bold text-red-600">₹{totalLost.toLocaleString()}</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <TrendingUp size={14} className="mx-auto mb-1 text-green-600" />
          <div className="text-xs text-gray-500 mb-1">Recovered</div>
          <div className="text-base font-bold text-green-600">₹{recovered.toLocaleString()}</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-600">Protection Rate</span>
          <span className="font-bold text-blue-600">{protectionRate}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(protectionRate, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-900">
          💡 GigCrest has protected <span className="font-bold">{protectionRate}%</span> of your weather-related income loss!
        </p>
      </div>
    </Card>
  );
};