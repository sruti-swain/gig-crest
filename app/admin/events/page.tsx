
'use client';

import React from 'react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import { CloudRain } from 'lucide-react';
import { adminData } from '@/lib/data';

export default function EventsPage() {
  const { isMobile } = useWindowSize();

  return (
    <>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '25px' }}>Live Events</h1>
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {adminData.liveEvents.map((event, index) => (
            <div key={index} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
              padding: '14px 16px', background: '#f8fafc', borderRadius: '12px',
              borderLeft: `4px solid ${event.severity === 'T4' ? '#dc2626' : event.severity === 'T3' ? '#f97316' : event.severity === 'T2' ? '#eab308' : '#22c55e'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CloudRain size={18} color="#64748b" />
                <div>
                  <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.95rem' }}>{event.zone} - {event.event}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{event.workers.toLocaleString()} workers affected</div>
                </div>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                background: event.severity === 'T4' ? '#fee2e2' : event.severity === 'T3' ? '#ffedd5' : event.severity === 'T2' ? '#fef9c3' : '#dcfce7',
                color: event.severity === 'T4' ? '#dc2626' : event.severity === 'T3' ? '#ea580c' : event.severity === 'T2' ? '#ca8a04' : '#16a34a'
              }}>{event.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}