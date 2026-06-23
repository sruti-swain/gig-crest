'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CloudRain,
  Thermometer,
  Cloud,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { Claim } from '@/types';

interface ClaimCardProps {
  claim: Claim;
}

const getEventIcon = (eventType: string) => {
  switch (eventType.toLowerCase()) {
    case 'heavy_rain':
    case 'rain':
      return CloudRain;
    case 'extreme_heat':
    case 'heat':
      return Thermometer;
    case 'pollution':
    case 'aqi':
      return Cloud;
    default:
      return AlertTriangle;
  }
};

const getEventLabel = (eventType: string) => {
  const labels: Record<string, string> = {
    heavy_rain: 'Heavy Rain',
    rain: 'Rain',
    extreme_heat: 'Heatwave',
    heat: 'Heat',
    pollution: 'Poor AQI',
    aqi: 'Poor AQI',
    flood: 'Flood',
    strike: 'Strike',
    curfew: 'Curfew'
  };

  return labels[eventType.toLowerCase()] || eventType;
};

const getStatusBadge = (status: string) => {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Paid' },
    auto_approved: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Approved' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Approved' },
    manual_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Processing' },
    under_review: { bg: 'bg-orange-100', text: 'text-orange-800', label: '🟠 In Review' },
    denied: { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Denied' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' }
  };

  const config = configs[status] || configs.pending;

  return (
    <Badge className={`${config.bg} ${config.text} text-xs font-semibold`}>
      {config.label}
    </Badge>
  );
};

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const [expanded, setExpanded] = useState(false);
  const eventType = String(claim.eventType);
  const status = String(claim.status);
  const EventIcon = getEventIcon(eventType);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              claim.severityTier === 'T4'
                ? 'bg-red-100'
                : claim.severityTier === 'T3'
                ? 'bg-orange-100'
                : claim.severityTier === 'T2'
                ? 'bg-yellow-100'
                : 'bg-green-100'
            }`}
          >
            <EventIcon
              size={18}
              className={
                claim.severityTier === 'T4'
                  ? 'text-red-600'
                  : claim.severityTier === 'T3'
                  ? 'text-orange-600'
                  : claim.severityTier === 'T2'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }
            />
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-gray-900">
                {getEventLabel(eventType)}
              </span>
              <Badge variant="outline" className="text-xs">
                {claim.severityTier}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">{formatDate(claim.claimDate)}</div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              ₹{claim.approvedPayout}
            </div>
            {getStatusBadge(status)}
          </div>
        </div>

        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Claim ID</div>
              <div className="text-xs font-mono font-bold text-gray-700">{claim.id}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Event ID</div>
              <div className="text-xs font-mono font-bold text-gray-700">{claim.eventId}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Hours Affected</div>
              <div className="text-sm font-bold text-gray-900">
                {claim.hoursAffected ?? 0}h
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Coverage</div>
              <div className="text-sm font-bold text-gray-900">
                {claim.coveragePercentage ?? 0}%
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-white rounded-lg">
            <div className="text-xs font-semibold text-gray-700 mb-2">Payout Breakdown</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Earning:</span>
                <span className="font-semibold">₹{claim.dailyEarningBasis ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Coverage ({claim.coveragePercentage ?? 0}%):
                </span>
                <span className="font-semibold">
                  ₹{Math.round(((claim.dailyEarningBasis ?? 0) * (claim.coveragePercentage ?? 0)) / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Severity ({claim.severityTier}):</span>
                <span className="font-semibold">×{claim.severityFactor ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours Ratio:</span>
                <span className="font-semibold">
                  {(((claim.hoursRatio ?? 0) * 100)).toFixed(0)}%
                </span>
              </div>
              <div className="border-t border-gray-200 pt-1 mt-2 flex justify-between">
                <span className="font-bold text-gray-900">Final Payout:</span>
                <span className="font-bold text-green-600">₹{claim.approvedPayout}</span>
              </div>
            </div>
          </div>

          {claim.fraudScore > 0 && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-1">Verification</div>
              <div className="flex items-center gap-2">
                {claim.fraudScore <= 45 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 font-medium">Passed ✓</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-orange-700 font-medium">Under Review</span>
                  </>
                )}
              </div>

              {Array.isArray(claim.fraudFlags) && claim.fraudFlags.length > 0 && (
                <div className="mt-2 space-y-1">
                  {claim.fraudFlags.map((flag, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {typeof flag === 'string'
                        ? flag
                        : `${flag.description}${flag.score ? ` (+${flag.score})` : ''}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {claim.paymentId && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs text-gray-500 mb-1">Payment ID</div>
              <div className="text-xs font-mono font-bold text-green-700">{claim.paymentId}</div>
              {claim.paidAt && (
                <div className="text-xs text-gray-500 mt-1">
                  Paid on {formatDate(claim.paidAt)} at {formatTime(claim.paidAt)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ClaimCard;