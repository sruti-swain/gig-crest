// components/worker/PolicyCard.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Calendar, DollarSign } from 'lucide-react';
import { Policy } from '@/types';
import { useRouter } from 'next/navigation';

interface PolicyCardProps {
  policy: Policy | null;
  claimsThisWeek?: number;
  claimsThisMonth?: number;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ 
  policy, 
  claimsThisWeek = 0, 
  claimsThisMonth = 0 
}) => {
  const router = useRouter();

  if (!policy) {
    return (
      <Card className="p-6 mb-6 border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Active Policy</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get protected from weather disruptions today!
          </p>
          <Button 
            onClick={() => router.push('/worker/buy-policy')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Buy Policy Now
          </Button>
        </div>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-5 mb-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Active Policy</h3>
            <Badge className="bg-green-100 text-green-800 text-xs mt-1">
              ✓ Active
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Policy ID</div>
          <div className="text-xs font-mono font-bold text-gray-700">{policy.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">Valid Period</span>
          </div>
          <div className="text-sm font-bold text-gray-900">
            {formatDate(policy.weekStart)}
          </div>
          <div className="text-xs text-gray-500">
            to {formatDate(policy.weekEnd)}
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">Premium</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            ₹{policy.finalPremium}
          </div>
          <div className="text-xs text-gray-500">per week</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg mb-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Coverage</div>
            <div className="text-sm font-bold text-gray-900">{policy.coveragePercentage}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Max/Day</div>
            <div className="text-sm font-bold text-green-600">₹{policy.maxDailyPayout}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mb-4">
        <span className="text-gray-600">
          Claims: {claimsThisWeek}/{policy.maxWeeklyPayouts} week | {claimsThisMonth}/{policy.maxMonthlyPayouts} month
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/worker/buy-policy')}
          className="text-xs"
        >
          Renew
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => alert('Policy Details:\n\n' + JSON.stringify(policy, null, 2))}
          className="text-xs"
        >
          Details
        </Button>
      </div>
    </Card>
  );
};