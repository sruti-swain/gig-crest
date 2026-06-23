'use client';

import { Card } from '@/components/ui/card';
import { Zap, Shield, FileText, AlertTriangle, DollarSign } from 'lucide-react';

interface Stats {
  activeEvents: number;
  activePolicies: number;
  claimsToday: number;
  fraudAlerts: number;
  payoutToday: number;
}

interface LiveStatusCardsProps {
  stats: Stats;
  loading?: boolean;
}

const cards = [
  {
    key: 'activeEvents',
    label: 'Active Events',
    icon: Zap,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    format: (v: number) => String(v),
    alert: true,
  },
  {
    key: 'activePolicies',
    label: 'Active Policies',
    icon: Shield,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    format: (v: number) => v.toLocaleString(),
    alert: false,
  },
  {
    key: 'claimsToday',
    label: 'Claims Today',
    icon: FileText,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    format: (v: number) => String(v),
    alert: false,
  },
  {
    key: 'fraudAlerts',
    label: 'Fraud Alerts',
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    format: (v: number) => String(v),
    alert: true,
  },
  {
    key: 'payoutToday',
    label: "Today's Payout",
    icon: DollarSign,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    format: (v: number) => `₹${v.toLocaleString()}`,
    alert: false,
  },
];

export default function LiveStatusCards({ stats, loading }: LiveStatusCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats?.[card.key as keyof Stats] ?? 0;

        return (
          <Card key={card.key} className="p-4 bg-white border shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <Icon size={18} className={card.iconColor} />
              </div>
              {card.alert && value > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1" />
              )}
            </div>

            {loading ? (
              <div className="h-7 w-16 bg-slate-200 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-slate-800">
                {card.format(value)}
              </p>
            )}

            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
          </Card>
        );
      })}
    </div>
  );
}