import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Zap, ShieldCheck, Award, ArrowRight, ArrowLeft, Phone, Copy, Check } from 'lucide-react';

interface HeroProps {
  onStartRecharge: () => void;
  onTrackOrder: () => void;
}

export function Hero({ onStartRecharge, onTrackOrder }: HeroProps) {
  const { t, dir, language } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const paymentNumber = '31520844';

  const copyNumber = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-white/5 bg-gradient-to-b from-[#0b0d12] via-[#0e1219] to-[#0b0c10]">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text and Actions Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start">
            
            {/* Value Pillars Kicker - clean unboxed typography */}
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-4 tracking-wide">
              <span>{t.pillars}</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">موريتانيا 100%</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5 text-balance">
              {language === 'ar' ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-400">
                    SHADOW STORE
                  </span>
                  <br />
                  <span>هو خيارك الأمثل لشحن الألعاب</span>
                </>
              ) : (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-400">
                    SHADOW STORE
                  </span>
                  <br />
                  <span>Your Premier Gaming Recharge Vault</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              {language === 'ar'
                ? 'متجر الألعاب الرقمي الرائد في موريتانيا. شحن فوري لجواهر فري فاير بالمعرف ID، شدات ببجي موبايل، كوينز إي فوتبول ونقاط EA FC بأفضل الأسعار وأعلى معايير الأمان.'
                : 'Mauritania’s leading digital game top-up vault. Official Free Fire ID diamonds, PUBG Mobile UC, eFootball coins & EA FC points with instant Bankily, Masrivi & Sedad fulfillment.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onStartRecharge}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-black hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{t.rechargeNow}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={onTrackOrder}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#151922] text-slate-200 hover:text-white hover:bg-[#1c222e] border border-amber-500/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t.trackOrder}</span>
              </button>
            </div>

            {/* Payment Info Card */}
            <div className="p-4 rounded-xl bg-[#11151e]/80 border border-amber-500/20 backdrop-blur-sm max-w-xl">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-semibold text-slate-400">
                  {t.officialNumber}:
                </span>
                <button
                  onClick={copyNumber}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'نسخ الرقم' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <div className="text-2xl font-black text-amber-400 font-mono tracking-wider">
                  {paymentNumber}
                </div>
                {/* Payment Methods Badges */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <span className="text-emerald-400">بنكيلي</span>
                  <span>/</span>
                  <span className="text-amber-300">مصريفي</span>
                  <span>/</span>
                  <span className="text-orange-400">سداد</span>
                </div>
              </div>
            </div>

          </div>

          {/* Visual Showcase Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-black/80 group">
              <img
                src="/src/assets/images/hero_shadow_store_1792943357075.jpg"
                alt="Shadow Store Gaming Vault"
                className="w-full h-72 sm:h-84 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-80" />
              
              {/* Overlay Kicker */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0e1219]/90 border border-white/10 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-400">شحن آمن 100%</p>
                  <p className="text-[11px] text-slate-300">تنفيذ عبر المعرف ID بدون كلمة مرور</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                  <span>⚡ 2–10 min</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
