// components/shared/StatCard.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBg?: string;
  valueColor?: string;
  footerText?: string;
  highlight?: boolean;
  border?: string;   // ✅ ADD THIS
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = '#2563eb',
  iconBg = '#dbeafe',
  valueColor = '#1a1a1a',
  footerText,
  highlight = false
}) => {
  return (
    <Card
      className={`
        p-5 transition-all
        ${highlight ? 'border-2 border-red-300 bg-red-50' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={22} color={iconColor} />
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            {label}
          </div>

          <div
            className="text-2xl font-bold"
            style={{ color: valueColor }}
          >
            {value}
          </div>

          {footerText && (
            <div className="text-xs text-gray-500 mt-1">
              {footerText}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;