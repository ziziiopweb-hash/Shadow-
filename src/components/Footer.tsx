import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { MessageSquare, Shield, Clock, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-white/5 bg-[#080a0e] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        
        {/* Brand Info (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <BrandLogo size="md" />
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-3">
            {language === 'ar'
              ? 'SHADOW STORE — متجر شحن الألعاب الرقمية الأول في موريتانيا. شحن رسمي معتمد لجواهر فري فاير، شدات ببجي، كوينز إي فوتبول ونقاط EA FC.'
              : 'SHADOW STORE — Mauritania’s premier digital gaming store. Official authorized recharge for Free Fire, PUBG Mobile, eFootball, and EA SPORTS FC.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span>{t.pillars}</span>
          </div>
        </div>

        {/* Quick Nav Links (3 cols) */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            {language === 'ar' ? 'روابط المتجر' : 'Quick Navigation'}
          </h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigate('home')} 
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navHome}
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('catalog')} 
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navGames}
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('track')} 
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navTrack}
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('support')} 
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navSupport}
              </button>
            </li>
          </ul>
        </div>

        {/* Mauritania Official Payment & Contact (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
            {t.officialNumber}
          </h4>

          <div className="p-3.5 rounded-xl bg-[#0f121a] border border-amber-500/20">
            <span className="text-[11px] text-slate-400 block mb-1">
              بنكيلي / مصريفي / سداد:
            </span>
            <span className="text-xl font-black text-amber-400 font-mono tracking-wider">
              31520844
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>09:00 - 02:00 GMT ({language === 'ar' ? 'توقيت موريتانيا' : 'Mauritania'})</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>واتساب المعتمد: +222 31520844</span>
          </div>
        </div>

      </div>

      {/* Clean Copyright Bottom */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} SHADOW STORE. جميع الحقوق محفوظة لمتجر شادو ستور موريتانيا.
        </div>
        <div className="flex items-center gap-3">
          <span>بنكيلي (Bankily)</span>
          <span>·</span>
          <span>مصريفي (Masrivi)</span>
          <span>·</span>
          <span>سداد (Sedad)</span>
        </div>
      </div>
    </footer>
  );
}
