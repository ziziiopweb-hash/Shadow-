import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Announcement } from '../types/index.ts';
import { Bell, ChevronLeft, ChevronRight, X } from 'lucide-react';

export function AnnouncementBar() {
  const { language } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data);
        }
      })
      .catch(err => console.error('Failed to load announcements:', err));
  }, []);

  if (dismissed || announcements.length === 0) {
    return null;
  }

  const current = announcements[currentIndex];
  const title = language === 'ar' ? current.titleAr : current.titleEn;
  const content = language === 'ar' ? current.contentAr : current.contentEn;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div className="relative bg-gradient-to-r from-[#17130a] via-[#1c180e] to-[#17130a] border-b border-amber-500/20 text-xs text-amber-200/90 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <p className="truncate font-medium text-slate-200">
            <span className="font-bold text-amber-400">{title}</span>
            <span className="mx-2 text-slate-500">·</span>
            <span className="text-slate-300">{content}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {announcements.length > 1 && (
            <>
              <button 
                onClick={prev} 
                className="p-1 hover:text-white text-slate-400 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {currentIndex + 1}/{announcements.length}
              </span>
              <button 
                onClick={next} 
                className="p-1 hover:text-white text-slate-400 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:text-white text-slate-400 transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
