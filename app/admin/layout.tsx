'use client';

import React, { useState } from 'react';
import { Shield, Menu, X, BarChart3, Activity, AlertTriangle, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useWindowSize } from '@/components/hooks/useWindowSize';
import NavButton from '@/components/shared/NavButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/events', label: 'Live Events', icon: Activity },
    { href: '/admin/fraud', label: 'Fraud Detection', icon: AlertTriangle },
    { href: '/admin/claims', label: 'Claims', icon: FileText },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile Top Bar */}
      <div style={{
        display: isMobile ? 'flex' : 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
        background: 'linear-gradient(135deg, #1b4332 0%, #0f2419 100%)',
        padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 15px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '18px', fontWeight: 700 }}>
          <Shield size={22} />
          <span>GigCrest Admin</span>
        </div>
        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {sidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button" tabIndex={0} aria-label="Close sidebar"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      )}

      {/* Sidebar */}
      <div style={{
        width: isMobile ? '280px' : '260px',
        background: 'linear-gradient(180deg, #1b4332 0%, #0f2419 100%)',
        color: 'white', padding: '20px', display: 'flex', flexDirection: 'column',
        position: 'fixed',
        height: isMobile ? 'calc(100vh - 56px)' : '100vh',
        top: isMobile ? '56px' : 0,
        left: isMobile ? (sidebarOpen ? 0 : '-280px') : 0,
        zIndex: isMobile ? 999 : 'auto',
        transition: 'left 0.3s ease',
        overflowY: 'auto', overflowX: 'hidden'
      }}>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 700, marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Shield size={24} />
            <span>GigCrest Admin</span>
          </div>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
              <NavButton active={pathname === link.href}>
                {React.createElement(link.icon, { size: 18 })} {link.label}
              </NavButton>
            </Link>
          ))}
          <NavButton active={false}><Users size={18} /> Workers</NavButton>
          <NavButton active={false}><Settings size={18} /> Settings</NavButton>
        </nav>

        <div style={{ flex: 1, minHeight: '20px' }} />

        <div style={{
          position: 'sticky', bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, #0f2419 20%)',
          paddingTop: '30px', paddingBottom: '10px', marginTop: 'auto'
        }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '14px 16px', width: '100%',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '15px',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
            textDecoration: 'none', boxSizing: 'border-box'
          }}>
            <LogOut size={18} /> Back to Home
          </Link>
        </div>
      </div>

      <div style={{
        flex: 1, marginLeft: isMobile ? 0 : '260px',
        padding: isMobile ? '70px 15px 30px' : '25px 30px',
        overflowY: 'auto', minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
}