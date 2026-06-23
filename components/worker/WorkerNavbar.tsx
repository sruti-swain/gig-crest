// components/worker/WorkerNavbar.tsx
'use client';

import React from 'react';
import { Home, FileText, MapPin, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path, active }) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(path)}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
        active ? 'text-blue-600' : 'text-gray-400'
      }`}
    >
      <Icon size={22} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export const WorkerNavbar: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/worker/dashboard' },
    { icon: FileText, label: 'Claims', path: '/worker/claims' },
    { icon: MapPin, label: 'Map', path: '/worker/map' },
    { icon: User, label: 'Profile', path: '/worker/profile' }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around max-w-md mx-auto shadow-lg z-50">
      {navItems.map(item => (
        <NavItem
          key={item.path}
          {...item}
          active={pathname === item.path}
        />
      ))}
    </nav>
  );
};