'use client';

import React from 'react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import { adminData } from '@/lib/data';

export default function FraudPage() {
  const { isMobile } = useWindowSize();

  return (
    <>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '25px' }}>Fraud Detection</h1>
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '450px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Claim ID</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Worker</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Risk Score</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {adminData.fraudulentClaims.map((claim, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#dc2626', fontSize: '0.9rem' }}>{claim.id}</td>
                  <td style={{ padding: '12px', color: '#4a5568', fontSize: '0.9rem' }}>{claim.worker}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${claim.risk}%`, background: claim.risk >= 80 ? '#dc2626' : claim.risk >= 60 ? '#f97316' : '#eab308', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontWeight: 700, color: claim.risk >= 80 ? '#dc2626' : claim.risk >= 60 ? '#f97316' : '#ca8a04', fontSize: '0.85rem' }}>{claim.risk}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#4a5568' }}>{claim.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}