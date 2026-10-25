import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Product } from '../types/index.ts';
import { Zap, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface EFootballPromoBannerProps {
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export function EFootballPromoBanner({ onSelectProduct, products }: EFootballPromoBannerProps) {
  const { t, language, dir, formatCurrency } = useLanguage();

  // Find eFootball products
  const efootballCoins = products.filter(p => p.gameId === 'efootball');
  const featuredCoinPack = efootballCoins.find(p => p.id === 'efb-coins-550') || efootballCoins[0];

  return (
    <div className="my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c101a] via-[#121626] to-[#090b12] border border-cyan-500/30 shadow-2xl">
        
        {/* Glow particle accents */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-10">
          
          {/* Visual Showcase (5 cols): The generated vertical eFootball promotional card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs rounded-2xl overflow-hidden border border-cyan-400/40 shadow-2xl shadow-cyan-950/60 group">
              <img
                src="/src/assets/images/efootball_yamal_pink_promo_1792944382821.jpg"
                alt="eFootball Pro Championship Special"
                className="w-full h-auto object-cover object-top group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-transparent to-transparent opacity-85" />
              
              {/* Clean bottom badge */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#0d121f]/90 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400">
                    eFootball PES 2026
                  </span>
                  <p className="text-xs font-bold text-white">
                    {language === 'ar' ? 'شحن فوري بالآيدي' : 'Instant Coins via ID'}
                  </p>
                </div>
                <span className="text-xs font-mono font-black text-amber-400">
                  ⚡ 55 MRU ~
                </span>
              </div>
            </div>
          </div>

          {/* Offer Details & Quick Recharge (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start">
            
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white tracking-wider uppercase">
                {language === 'ar' ? 'عرض خاص لكرة القدم' : 'Special Football Promo'}
              </span>
              <span className="text-xs text-slate-400 font-bold">SHADOW STORE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">
              {language === 'ar' 
                ? 'طور تشكيلة أحلامك مع باقات كوينز إي فوتبول المعتمدة' 
                : 'Build Your Dream Team with Verified eFootball Coins'}
            </h3>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed max-w-xl">
              {language === 'ar'
                ? 'احصل على الكوينز الرسمية لفتح باكات اللاعبين الإبيك (Epic) والنجوم العالميين. شحن مباشر عبر المعرف، ودفع فوري عبر بنكيلي، مصريفي، أو سداد على الرقم 31520844.'
                : 'Top-up official eFootball coins to sign Epic legends and build an unstoppable squad. Fast ID top-up with instant Bankily, Masrivi, or Sedad payment to 31520844.'}
            </p>

            {/* Quick Coin Packages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {efootballCoins.slice(0, 3).map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => onSelectProduct(pack)}
                  className="p-3 rounded-xl bg-[#151a28] hover:bg-[#1a2133] border border-cyan-500/20 hover:border-cyan-400/50 transition-all text-start cursor-pointer group"
                >
                  <p className="text-xs font-extrabold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {language === 'ar' ? pack.nameAr : pack.nameEn}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-black text-amber-400 font-mono tabular-nums">
                      {pack.priceMru}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'أوقية' : 'MRU'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* CTA */}
            {featuredCoinPack && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectProduct(featuredCoinPack)}
                  className="px-6 py-3 rounded-xl font-extrabold text-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-fuchsia-600 text-black hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>{language === 'ar' ? 'شحن كوينز إي فوتبول الآن' : 'Recharge eFootball Coins'}</span>
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'ضمان وصول الكوينز 100%' : '100% Delivery Guarantee'}</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
