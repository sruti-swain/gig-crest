'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Event {
  id: string;
  eventType: string;
  zoneName: string;
  city: string;
  severityTier: string;
  eventStart: string;
  durationHours: number;
  claimsGenerated: number;
  totalPayoutAmount: number;
  isActive?: boolean;
  measurements?: {
    rainfall?: number;
    temperature?: number;
    aqi?: number;
    windSpeed?: number;
  };
}

interface EventsTableProps {
  events: Event[];
  loading?: boolean;
}

const severityColors: Record<string, string> = {
  T1: 'bg-yellow-100 text-yellow-800',
  T2: 'bg-orange-100 text-orange-800',
  T3: 'bg-red-100 text-red-800',
  T4: 'bg-red-200 text-red-900 font-bold',
};

const eventTypeLabel: Record<string, string> = {
  heavy_rain: '🌧️ Heavy Rain',
  flood: '🌊 Flood',
  extreme_heat: '🌡️ Extreme Heat',
  pollution: '😷 AQI/Pollution',
  strike: '✊ Strike',
  curfew: '🚫 Curfew',
};

export default function EventsTable({ events, loading }: EventsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Event>('eventStart');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: keyof Event) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...events].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }: { col: keyof Event }) =>
    sortKey === col ? (
      sortDir === 'asc' ? (
        <ChevronUp size={12} className="inline ml-1" />
      ) : (
        <ChevronDown size={12} className="inline ml-1" />
      )
    ) : null;

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg font-semibold">No events found</p>
        <p className="text-sm mt-1">Simulate an event to see it here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
          <tr>
            {[
              { label: 'ID', key: 'id' },
              { label: 'Type', key: 'eventType' },
              { label: 'Zone', key: 'zoneName' },
              { label: 'City', key: 'city' },
              { label: 'Severity', key: 'severityTier' },
              { label: 'Start', key: 'eventStart' },
              { label: 'Duration', key: 'durationHours' },
              { label: 'Claims', key: 'claimsGenerated' },
              { label: 'Total Payout', key: 'totalPayoutAmount' },
              { label: 'Status', key: 'isActive' },
            ].map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap"
                onClick={() => handleSort(col.key as keyof Event)}
              >
                {col.label}
                <SortIcon col={col.key as keyof Event} />
              </th>
            ))}
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((event) => (
            <>
              <tr
                key={event.id}
                className={`transition-colors hover:bg-slate-50 ${
                  event.isActive ? 'bg-red-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {event.id?.slice(0, 8)}...
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {eventTypeLabel[event.eventType] || event.eventType}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {event.zoneName}
                </td>
                <td className="px-4 py-3 text-slate-600">{event.city}</td>
                <td className="px-4 py-3">
                  <Badge className={severityColors[event.severityTier] || ''}>
                    {event.severityTier}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {new Date(event.eventStart).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {event.durationHours}h
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {event.claimsGenerated}
                </td>
                <td className="px-4 py-3 font-semibold text-green-700">
                  ₹{event.totalPayoutAmount?.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {event.isActive ? (
                    <Badge className="bg-red-100 text-red-700 animate-pulse">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-600">
                      Ended
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === event.id ? null : event.id)
                    }
                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                  >
                    {expandedId === event.id ? 'Hide ▲' : 'Show ▼'}
                  </button>
                </td>
              </tr>

              {/* EXPANDED ROW */}
              {expandedId === event.id && (
                <tr key={`${event.id}-detail`} className="bg-slate-50">
                  <td colSpan={11} className="px-6 py-4">
                    <Card className="p-4 bg-white border shadow-sm">
                      <p className="text-xs font-bold text-slate-700 mb-3 uppercase">
                        Event Measurements
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs">Rainfall</p>
                          <p className="font-semibold text-slate-800">
                            {event.measurements?.rainfall ?? 'N/A'} mm/hr
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Temperature</p>
                          <p className="font-semibold text-slate-800">
                            {event.measurements?.temperature ?? 'N/A'}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">AQI</p>
                          <p className="font-semibold text-slate-800">
                            {event.measurements?.aqi ?? 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Wind Speed</p>
                          <p className="font-semibold text-slate-800">
                            {event.measurements?.windSpeed ?? 'N/A'} km/hr
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs">Total Claims</p>
                          <p className="font-semibold text-slate-800">
                            {event.claimsGenerated}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Total Payout</p>
                          <p className="font-semibold text-green-700">
                            ₹{event.totalPayoutAmount?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Duration</p>
                          <p className="font-semibold text-slate-800">
                            {event.durationHours} hours
                          </p>
                        </div>
                      </div>
                    </Card>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}