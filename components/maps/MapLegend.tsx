// components/maps/MapLegend.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export const MapLegend: React.FC = () => {
  const items = [
    { color: '#22c55e', label: 'Safe - Low Risk' },
    { color: '#eab308', label: 'Watch - Medium Risk' },
    { color: '#f97316', label: 'Alert - High Risk' },
    { color: '#ef4444', label: 'Warning - Severe/Active' }
  ];

  return (
    <Card className="p-3 shadow-lg">
      <p className="text-xs font-bold text-gray-700 mb-2">Zone Status</p>
      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item.color} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs text-gray-700 font-semibold">Pulsing = Active Event</span>
        </div>
      </div>
    </Card>
  );
};