'use client';

import React from 'react';

interface NavButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavButton: React.FC<NavButtonProps> = ({
  children,
  active = false,
  onClick,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-4 py-3 rounded-lg
        transition-all duration-200 text-left
        ${active
          ? 'bg-white/10 text-white'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default NavButton;