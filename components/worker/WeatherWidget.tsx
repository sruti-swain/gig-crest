// components/worker/WeatherWidget.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { WeatherData } from '@/types';

interface WeatherWidgetProps {
  zoneId: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ zoneId }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather/zone/${zoneId}`);
        const data = await response.json();
        
        if (data.success) {
          setWeather(data.data.weather);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    if (zoneId) {
      fetchWeather();
      
      // Refresh every 5 minutes
      const interval = setInterval(fetchWeather, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [zoneId]);

  if (loading) {
    return (
      <Card className="p-4 mb-4">
        <div className="animate-pulse flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4 mb-4 bg-gray-50">
        <p className="text-sm text-gray-500">Weather data unavailable</p>
      </Card>
    );
  }

  const isSafe = weather.rainfall < 10 && weather.temperature < 40 && weather.aqi < 200;
  const hasWarning = weather.rainfall >= 20 || weather.temperature >= 40 || weather.aqi >= 300;

  return (
    <Card className={`p-4 mb-4 ${hasWarning ? 'border-2 border-orange-500 bg-orange-50' : 'bg-blue-50'}`}>
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        {hasWarning ? (
          <>
            <AlertTriangle size={16} className="text-orange-600" />
            <span className="text-orange-600">Weather Alert</span>
          </>
        ) : (
          <>
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-green-600">Current Conditions</span>
          </>
        )}
      </h3>
      
      <div className="grid grid-cols-4 gap-2 text-center mb-3">
        <div>
          <Sun size={18} className="mx-auto mb-1 text-orange-500" />
          <div className="text-xs font-bold">{weather.temperature}°C</div>
        </div>
        <div>
          <CloudRain size={18} className="mx-auto mb-1 text-blue-500" />
          <div className="text-xs font-bold">{weather.rainfall}mm</div>
        </div>
        <div>
          <Cloud size={18} className="mx-auto mb-1 text-purple-500" />
          <div className="text-xs font-bold">AQI {weather.aqi}</div>
        </div>
        <div>
          <Wind size={18} className="mx-auto mb-1 text-gray-500" />
          <div className="text-xs font-bold">{weather.windSpeed}km/h</div>
        </div>
      </div>
      
      {hasWarning && (
        <div className="bg-white rounded-lg p-3 border border-orange-200">
          <p className="text-xs font-medium text-orange-800">
            ⚠️ Adverse conditions detected. You're covered by GigCrest!
          </p>
        </div>
      )}
      
      {isSafe && (
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <p className="text-xs font-medium text-green-800">
            ✅ Good conditions for delivery. Stay safe!
          </p>
        </div>
      )}
    </Card>
  );
};