'use client';

import React from 'react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import { workerData } from '@/lib/data';

export default function ClaimsPage() {
  const { isMobile } = useWindowSize();

  return (
    <>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '25px' }}>
        Claims History
      </h1>
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Claim ID</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Event</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {workerData.recentClaims.map((claim, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#1a1a1a', fontSize: '0.9rem' }}>{claim.id}</td>
                  <td style={{ padding: '12px', color: '#4a5568', fontSize: '0.9rem' }}>{claim.event}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>{claim.amount}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                      background: claim.status === 'Approved' ? '#dcfce7' : claim.status === 'Processing' ? '#fef3c7' : '#fee2e2',
                      color: claim.status === 'Approved' ? '#16a34a' : claim.status === 'Processing' ? '#ca8a04' : '#dc2626'
                    }}>
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
