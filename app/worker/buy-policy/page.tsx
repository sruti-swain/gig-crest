
'use client';

import React from 'react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import { workerData } from '@/lib/data';

export default function BuyPolicyPage() {
  const { isMobile } = useWindowSize();

  return (
    <>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '25px' }}>
        My Plan
      </h1>
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '18px', color: '#1a1a1a', fontWeight: 700 }}>🛡️ Active Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Plan Type</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>{workerData.activePlan.type}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Premium</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb' }}>{workerData.activePlan.premium}/week</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Coverage</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>{workerData.activePlan.coverage}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Valid Until</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>{workerData.activePlan.validUntil}</div>
          </div>
        </div>
      </div>
    </>
  );
}