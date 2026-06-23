// hooks/useWorkerData.ts
'use client';

import { useState, useEffect } from 'react';
import { Worker, Policy, Claim, WeatherData } from '@/types';

interface WorkerDashboardData {
  worker: Worker | null;
  activePolicy: Policy | null;
  currentWeather: WeatherData | null;
  recentClaims: Claim[];
  stats: {
    totalPolicies: number;
    activePolicies: number;
    totalClaims: number;
    totalPayouts: number;
    claimsThisWeek: number;
    claimsThisMonth: number;
  };
  incomeProtection: {
    totalLost: number;
    recovered: number;
    protectionRate: number;
  };
}

export const useWorkerData = (workerId: string) => {
  const [data, setData] = useState<WorkerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/worker/dashboard/${workerId}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerId) {
      fetchData();
      
      // Refresh every 2 minutes
      const interval = setInterval(fetchData, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [workerId]);

  return { data, loading, error, refetch: fetchData };
};