// components/worker/ClaimsList.tsx
'use client';

import React from 'react';
import { ClaimCard } from './ClaimCard';
import { Claim } from '@/types';

interface ClaimsListProps {
  claims: Claim[];
  limit?: number;
  showViewAll?: boolean;
}

export const ClaimsList: React.FC<ClaimsListProps> = ({ 
  claims, 
  limit, 
  showViewAll = false 
}) => {
  const displayClaims = limit ? claims.slice(0, limit) : claims;

  if (claims.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No claims yet</p>
        <p className="text-xs text-gray-400 mt-2">Claims will appear here when weather events occur</p>
      </div>
    );
  }

  return (
    <div>
      {displayClaims.map(claim => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}
      
      {showViewAll && limit && claims.length > limit && (
        <button 
          onClick={() => window.location.href = '/worker/claims'}
          className="w-full py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All Claims ({claims.length}) →
        </button>
      )}
    </div>
  );
};