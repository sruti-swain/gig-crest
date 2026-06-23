// components/worker/StatsCards.tsx
'use client';

import React from 'react';
import { ShieldCheck, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | number;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  iconBg, 
  iconColor, 
  label, 
  value, 
  valueColor = '#1a1a1a' 
}) => (
  <Card className="p-4 flex gap-3 items-center">
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: iconBg }}
    >
      <Icon size={22} color={iconColor} />
    </div>
    <div className="min-w-0">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  </Card>
);

interface StatsCardsProps {
  totalEarnings: number;
  coverageStatus: string;
  totalClaims: number;
  protectionPercent: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalEarnings,
  coverageStatus,
  totalClaims,
  protectionPercent
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <StatCard
        icon={DollarSign}
        iconBg="#dbeafe"
        iconColor="#2563eb"
        label="Total Payouts"
        value={`₹${totalEarnings.toLocaleString()}`}
      />
      <StatCard
        icon={ShieldCheck}
        iconBg="#dcfce7"
        iconColor="#16a34a"
        label="Coverage"
        value={coverageStatus}
        valueColor="#16a34a"
      />
      <StatCard
        icon={FileText}
        iconBg="#fef3c7"
        iconColor="#ca8a04"
        label="Total Claims"
        value={totalClaims}
      />
      <StatCard
        icon={TrendingUp}
        iconBg="#fce7f3"
        iconColor="#db2777"
        label="Protection %"
        value={`${protectionPercent}%`}
      />
    </div>
  );
};