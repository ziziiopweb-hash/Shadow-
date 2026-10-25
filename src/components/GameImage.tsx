import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '3:4' | '1:1' | 'auto';
  fallbackText?: string;
  accentColor?: string;
  objectFit?: 'contain' | 'cover';
}

export function GameImage({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  fallbackText,
  accentColor = '#f59e0b',
  objectFit = 'contain'
}: GameImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(!src);

  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
    '1:1': 'aspect-square',
    'auto': ''
  };

  if (!src || hasError) {
    return (
      <div 
        className={`relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#121622] via-[#0e111a] to-[#0a0d14] border border-white/5 overflow-hidden p-4 text-center ${aspectClasses[aspectRatio]} ${className}`}
        style={{ borderTopColor: accentColor }}
      >
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-lg"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          <Gamepad2 className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-200 line-clamp-1">{alt}</p>
        {fallbackText && (
          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{fallbackText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
      {/* Loading Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-[#161a26] animate-pulse flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-slate-700 animate-bounce" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full ${objectFit === 'contain' ? 'object-contain object-center' : 'object-cover'} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
