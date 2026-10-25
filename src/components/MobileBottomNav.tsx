import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Home, Gamepad2, ShieldCheck, HelpCircle, User as UserIcon, ShieldAlert } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export function MobileBottomNav({ activeTab, setActiveTab, onOpenAuth }: MobileBottomNavProps) {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0d13]/95 backdrop-blur-lg border-t border-amber-500/20 px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 transition-colors ${
            activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[54px]">{t.navHome}</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center py-1 transition-colors ${
            activeTab === 'catalog' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[54px]">{language === 'ar' ? 'الألعاب' : 'Games'}</span>
        </button>

        {/* Track */}
        <button
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center py-1 transition-colors ${
            activeTab === 'track' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[54px]">{language === 'ar' ? 'تتبع' : 'Track'}</span>
        </button>

        {/* Support */}
        <button
          onClick={() => setActiveTab('support')}
          className={`flex flex-col items-center py-1 transition-colors ${
            activeTab === 'support' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[54px]">{language === 'ar' ? 'الدعم' : 'Support'}</span>
        </button>

        {/* Account / Admin */}
        <button
          onClick={() => {
            if (!user) {
              onOpenAuth();
            } else {
              setActiveTab(isAdmin ? 'admin' : 'account');
            }
          }}
          className={`flex flex-col items-center py-1 transition-colors ${
            (activeTab === 'account' || activeTab === 'admin') ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isAdmin ? (
            <ShieldAlert className="w-5 h-5 mb-0.5 text-orange-400" />
          ) : (
            <UserIcon className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] truncate max-w-[54px]">
            {isAdmin ? (language === 'ar' ? 'الإدارة' : 'Admin') : (user ? (language === 'ar' ? 'حسابي' : 'Account') : t.login)}
          </span>
        </button>

      </div>
    </div>
  );
}
