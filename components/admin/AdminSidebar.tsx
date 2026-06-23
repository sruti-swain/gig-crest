'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Zap,
  FileText,
  AlertTriangle,
  Map,
  LogOut,
  Shield,
  Users,
  Brain,
  Activity,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Events', href: '/admin/events', icon: Zap },
  { label: 'Claims', href: '/admin/claims', icon: FileText },
  { label: 'Fraud Alerts', href: '/admin/fraud', icon: AlertTriangle },
  { label: 'Zone Risk Map', href: '/admin/map', icon: Map },
  { label: 'Workers', href: '/admin/workers', icon: Users },
  { label: 'AI Engine', href: '/admin/ai', icon: Brain },
  { label: 'Live Tracking', href: '/admin/live', icon: Activity },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  return (
    <aside className="w-[250px] min-h-screen bg-slate-800 text-slate-200 flex flex-col fixed left-0 top-0 z-40">
      {/* LOGO */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400" size={28} />
          <div>
            <p className="font-bold text-white text-lg leading-tight">GigShield</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
                {item.label === 'Fraud Alerts' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
                {item.label === 'Live Tracking' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}