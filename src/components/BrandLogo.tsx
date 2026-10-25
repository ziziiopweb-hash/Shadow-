import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom stylized Shadow Store Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#1c1f26] via-[#11141a] to-[#0a0c10] border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden group`}>
        {/* Subtle fiery glow background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent opacity-80" />
        
        {/* Monogram SVG */}
        <svg viewBox="0 0 40 40" fill="none" className="w-5/6 h-5/6 relative z-10 transition-transform group-hover:scale-110">
          <path 
            d="M20 4L34 11V22C34 29 27.5 35 20 37C12.5 35 6 29 6 22V11L20 4Z" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            fill="#12151d"
          />
          {/* S-Shaped Lightning / Shadow Blade */}
          <path 
            d="M24 13C22 11.5 17 12 16 15C15 18 24 18.5 24 22.5C24 26 19 27 16 25.5M20 10V12M20 27V29" 
            stroke="url(#fireGradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="20" cy="19" r="1.5" fill="#f59e0b" />
          <defs>
            <linearGradient id="goldGradient" x1="6" y1="4" x2="34" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="0.5" stopColor="#d97706" />
              <stop offset="1" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="fireGradient" x1="16" y1="11" x2="24" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="0.6" stopColor="#f97316" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span className={`font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-400 ${textSizes[size]} leading-none uppercase`}>
          SHADOW STORE
        </span>
      </div>
    </div>
  );
}
