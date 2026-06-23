'use client';

import React, { useState } from 'react';
import { Users, ShieldCheck, FileText, DollarSign, AlertTriangle, CloudRain } from 'lucide-react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import { adminData } from '@/lib/data';
import StatCard from '@/components/shared/StatCard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LiveStatusCards from '@/components/admin/LiveStatusCards';
import EventsTable from '@/components/admin/EventsTable';

export default function AdminDashboardPage() {
  const { isMobile, isTablet } = useWindowSize();
  const [selectedZone, setSelectedZone] = useState('Zone A');
  const [selectedEvent, setSelectedEvent] = useState('rain');
  const [severity, setSeverity] = useState('T2');

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#1a1a1a', fontWeight: 700 }}>Admin Dashboard</h1>
        <button type="button"
          onClick={() => alert(`Event Simulation:\nZone: ${selectedZone}\nEvent: ${selectedEvent}\nSeverity: ${severity}\n\nGenerating claims, payouts, and fraud analysis...`)}
          style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          🎮 Run Simulation
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <StatCard icon={Users} iconBg="#dbeafe" iconColor="#2563eb" label="Total Workers" value={`${(adminData.totalWorkers / 1000).toFixed(1)}K`} />
        <StatCard icon={ShieldCheck} iconBg="#dcfce7" iconColor="#16a34a" label="Active Policies" value={`${(adminData.activePolicies / 1000).toFixed(1)}K`} />
        <StatCard icon={FileText} iconBg="#fef3c7" iconColor="#ca8a04" label="Total Claims" value={`${adminData.totalClaims}`} />
        <StatCard icon={DollarSign} iconBg="#d1fae5" iconColor="#059669" label="Total Payouts" value={adminData.totalPayouts} />
        <StatCard icon={AlertTriangle} iconBg="#fee2e2" iconColor="#dc2626" label="Fraud Alerts" value={adminData.fraudAlerts} valueColor="#dc2626" border="2px solid #fecaca" />
      </div>

      {/* Event Simulation Panel */}
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#1a1a1a', fontWeight: 700 }}>🎮 Event Simulation Panel</h3>
        <p style={{ color: '#64748b', marginBottom: '18px', fontSize: '0.9rem' }}>Simulate real-world events to test system response</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
          <div>
            <label htmlFor="zone-select" style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Select Zone</label>
            <select id="zone-select" value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer' }}>
              <option>Zone A</option><option>Zone B</option><option>Zone C</option>
            </select>
          </div>
          <div>
            <label htmlFor="event-select" style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Choose Event</label>
            <select id="event-select" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer' }}>
              <option value="rain">Heavy Rain</option><option value="heat">Heatwave</option><option value="aqi">Poor AQI</option>
            </select>
          </div>
          <div>
            <label htmlFor="severity-select" style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Set Severity</label>
            <select id="severity-select" value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer' }}>
              <option value="T1">T1 - Low</option><option value="T2">T2 - Medium</option><option value="T3">T3 - High</option><option value="T4">T4 - Extreme</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="button"
              onClick={() => alert(`Simulation Running:\nZone: ${selectedZone}\nEvent: ${selectedEvent}\nSeverity: ${severity}\n\nGenerating claims, payouts, and fraud analysis...`)}
              style={{ width: '100%', padding: '10px 20px', background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              🚀 Run
            </button>
          </div>
        </div>
      </div>

      {/* Live Events */}
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '18px', color: '#1a1a1a', fontWeight: 700 }}>📡 Live Weather Events</h3>
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

      {/* Claims Today */}
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '18px', color: '#1a1a1a', fontWeight: 700 }}>📊 Claims Today</h3>
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

      {/* Fraud Detection */}
      <div style={{ background: 'white', padding: isMobile ? '20px' : '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '18px', color: '#1a1a1a', fontWeight: 700 }}>🚨 Fraud Detection</h3>
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