'use client';

import React from 'react';
import { useWindowSize } from '@/components/hooks/useWindowSize';

export default function ProfilePage() {
  const { isMobile } = useWindowSize();

  return (
    <>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '25px' }}>
        My Profile
      </h1>
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '20px' }}>RK</div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a' }}>Rajesh Kumar</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Swiggy Delivery Partner</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Phone</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>+91 98765 43210</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>City</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>Delhi</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>UPI ID</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>rajesh@upi</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Member Since</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>Jan 2025</div>
          </div>
        </div>
      </div>
    </>
  );
}