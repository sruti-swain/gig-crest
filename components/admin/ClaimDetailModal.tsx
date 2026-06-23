// components/admin/ClaimDetailModal.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User, Calendar, DollarSign, Shield } from 'lucide-react';
import { Claim } from '@/types';

const getFraudBarColor = (score: number) => {
  if (score <= 20) return 'bg-green-500';
  if (score <= 45) return 'bg-yellow-500';
  if (score <= 70) return 'bg-orange-500';
  return 'bg-red-500';
};

interface ClaimDetailModalProps {
  claim: Claim | null;
  onClose: () => void;
}


export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ claim, onClose }) => {
  // 🛡️ SAFETY CHECK: If no claim, don't render
  if (!claim) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string }> = {
      'paid': { bg: 'bg-green-100', text: 'text-green-800' },
      'auto_approved': { bg: 'bg-green-100', text: 'text-green-800' },
      'approved': { bg: 'bg-green-100', text: 'text-green-800' },
      'manual_review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'denied': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    const config = configs[status] || configs['manual_review'];
    return (
      <Badge className={`${config.bg} ${config.text} font-bold`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getFraudLevel = (score: number) => {
    if (score <= 20) return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50' };
    if (score <= 45) return { label: 'Medium Risk', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score <= 70) return { label: 'High Risk', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Critical Risk', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const fraudLevel = getFraudLevel(claim.fraudScore || 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Claim Details</h2>
            <p className="text-sm text-gray-500 font-mono">{claim.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Status</span>
            {getStatusBadge(claim.status)}
          </div>

          {/* Worker Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-gray-600" />
              <h3 className="text-sm font-bold text-gray-900">Worker Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 font-semibold text-gray-900">{claim.workerName}</span>
              </div>
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 font-mono font-semibold text-gray-900">{claim.workerId}</span>
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-gray-600" />
              <h3 className="text-sm font-bold text-gray-900">Event Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 font-semibold text-gray-900 capitalize">
                  {claim.eventType?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Severity:</span>
                <Badge variant="outline" className="ml-2 font-bold">{claim.severityTier}</Badge>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 font-semibold text-gray-900">{formatDate(claim.claimDate)}</span>
              </div>
              <div>
                <span className="text-gray-500">Event ID:</span>
                <span className="ml-2 font-mono text-xs font-semibold text-gray-900">{claim.eventId}</span>
              </div>
            </div>
          </div>

          {/* Payout Breakdown */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Payout Calculation</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Earning Basis:</span>
                <span className="font-semibold">₹{claim.dailyEarningBasis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coverage Percentage:</span>
                <span className="font-semibold">{claim.coveragePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Severity Factor:</span>
                <span className="font-semibold">×{claim.severityFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours Affected:</span>
               <span className="font-semibold">
  {claim.hoursAffected ?? 0}h ({((claim.hoursRatio ?? 0) * 100).toFixed(0)}%)
</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-600">Calculated Payout:</span>
                <span className="font-semibold text-blue-600">₹{claim.calculatedPayout}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-blue-200">
                <span className="text-gray-600">Final Approved:</span>
                <span className="text-lg font-bold text-green-600">₹{claim.approvedPayout}</span>
              </div>
            </div>
          </div>

          {/* Fraud Analysis */}
          <div className={`p-4 rounded-lg border-2 ${fraudLevel.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className={fraudLevel.color} />
              <h3 className="text-sm font-bold text-gray-900">Fraud Analysis</h3>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Risk Score</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getFraudBarColor(claim.fraudScore || 0)} transition-all`}
                    style={{ width: `${claim.fraudScore || 0}%` }}
                  ></div>
                </div>
                <span className={`text-lg font-bold ${fraudLevel.color}`}>
                  {claim.fraudScore || 0}/100
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">Assessment:</span>
                <Badge className={`${fraudLevel.bg} ${fraudLevel.color} border ${fraudLevel.color}`}>
                  {fraudLevel.label}
                </Badge>
              </div>
              
              {claim.fraudFlags && claim.fraudFlags.length > 0 ? (
                <div className="space-y-1 mt-2">
                  {claim.fraudFlags.map((flag, idx) => (
                    <div key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span className="flex-1">{flag.description || 'Unknown issue'}</span>
<span className="font-semibold">+{flag.score ?? 0}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-green-700 mt-2">
                  ✓ No fraud indicators detected
                </p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {claim.paymentId && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-xs font-semibold text-gray-700 mb-2">Payment Information</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono font-semibold text-green-700">{claim.paymentId}</span>
                </div>
                {claim.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At:</span>
                    <span className="font-semibold text-gray-900">{formatDate(claim.paidAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {claim.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};