import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Globe, User as UserIcon, ShieldAlert, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export function Header({ activeTab, setActiveTab, onOpenAuth }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/15 bg-[#0b0d12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand element */}
        <button 
          onClick={() => setActiveTab('home')}
          className="whitespace-nowrap shrink-0 focus:outline-none flex items-center"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold tracking-wide">
          <button 
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'home' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            {t.navHome}
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'catalog' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            {t.navGames}
          </button>
          <button 
            onClick={() => setActiveTab('track')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'track' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            {t.navTrack}
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'support' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            {t.navSupport}
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${activeTab === 'admin' ? 'text-orange-400 border-b-2 border-orange-400 font-bold' : 'text-orange-400/90 hover:text-orange-300'}`}
            >
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>{t.adminDashboard}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#151922] text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(isAdmin ? 'admin' : 'account')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors whitespace-nowrap shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[120px] truncate">{user.fullName.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all whitespace-nowrap shrink-0"
            >
              {t.login}
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
