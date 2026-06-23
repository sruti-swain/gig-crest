'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Zone, DisruptionEvent, WeatherData } from '@/types';

interface ZonePopupProps {
  zone: Zone;
  activeEvent?: DisruptionEvent;
  weather?: WeatherData;
  workerCount?: number;
  policyCount?: number;
}

export const ZonePopup: React.FC<ZonePopupProps> = ({
  zone,
  activeEvent,
  weather,
  workerCount = 0,
  policyCount = 0
}) => {
  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600'
    };

    return colors[level] || 'text-gray-600';
  };

  return (
    <div className="min-w-[220px] p-2">
      <h3 className="font-bold text-base text-gray-900 mb-1">{zone.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{zone.city}</p>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Risk Level:</span>
          <span className={`font-semibold capitalize ${getRiskColor(zone.riskLevel)}`}>
            {zone.riskLevel}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Multiplier:</span>
          <span className="font-semibold text-gray-900">{zone.basePremiumFactor}x</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Active Workers:</span>
          <span className="font-semibold text-gray-900">{workerCount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Active Policies:</span>
          <span className="font-semibold text-gray-900">{policyCount}</span>
        </div>
      </div>

      {weather && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Current Conditions:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-500">Temp:</span>
              <span className="ml-1 font-semibold">{weather.temperature}°C</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-500">Rain:</span>
              <span className="ml-1 font-semibold">{weather.rainfall}mm</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-500">AQI:</span>
              <span className="ml-1 font-semibold">{weather.aqi}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-500">Wind:</span>
              <span className="ml-1 font-semibold">{weather.windSpeed}km/h</span>
            </div>
          </div>
        </div>
      )}

      {activeEvent && (
        <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 -mx-2 -mb-2 p-3 rounded-b">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-bold text-red-800 uppercase">
              Active Event: {String(activeEvent.eventType).replace('_', ' ')}
            </p>
          </div>

          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Severity:</span>
              <Badge className="bg-red-600 text-white text-xs">
                {activeEvent.severityTier}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Claims Generated:</span>
              <span className="font-bold text-gray-900">{activeEvent.claimsGenerated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Payout:</span>
              <span className="font-bold text-green-600">
                ₹{activeEvent.totalPayoutAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonePopup;