'use client';

import React from 'react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import { adminData } from '@/lib/data';

export default function AdminClaimsPage() {
  const { isMobile } = useWindowSize();

  return (
    <>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '25px' }}>Claims Review</h1>
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#eff6ff', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{adminData.claimsToday.total}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Approved</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{adminData.claimsToday.approved}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#fefce8', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Pending</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ca8a04' }}>{adminData.claimsToday.pending}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#fef2f2', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Rejected</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{adminData.claimsToday.rejected}</div>
          </div>
        </div>
      </div>
    </>
  );
}