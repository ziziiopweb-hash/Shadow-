import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Product, GameArtwork } from '../types/index.ts';
import { Search, Zap, Shield, Sparkles, UserCheck, KeyRound, Flame, ShoppingBag, AlertTriangle, Layers } from 'lucide-react';

// Direct imports of exact project static assets (ensures reliable bundle resolution on Vercel)
import efootballOriginalImg from '../assets/images/efootball_official_user.jpg';
import freeFireOriginalImg from '../assets/images/free_fire_official_user.jpg';
import pubgOriginalImg from '../assets/images/pubg_tactical_landscape_1792944226624.jpg';
import eaSportsFcOriginalImg from '../assets/images/ea_sports_fc_showcase_1792944226485.jpg';
import subscriptionsOriginalImg from '../assets/images/digital_cards_showcase_1792944226065.jpg';

interface GameCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  artworks?: GameArtwork[];
}

export function GameCatalog({ products, onSelectProduct, artworks: propArtworks }: GameCatalogProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [artworks, setArtworks] = useState<GameArtwork[]>(propArtworks || []);

  // Verification: Track missing original files without ever substituting with another image
  const missingOriginalFiles: string[] = [];
  if (!efootballOriginalImg) {
    missingOriginalFiles.push('public/assets/aistudio/IMG_99eb4f47-d254-4ab5-b447-de06effafee0_658a16ca.jpg');
  }
  if (!freeFireOriginalImg) {
    missingOriginalFiles.push('public/assets/aistudio/33ab4129a3cc0ba004d7034d34df75d1_e18e035c.jpg');
  }

  useEffect(() => {
    if (!propArtworks || propArtworks.length === 0) {
      fetch('/api/artworks')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setArtworks(data);
        })
        .catch(err => console.error('Failed to load artworks:', err));
    }
  }, [propArtworks]);

  // Primary Game Cards Showcase (Exact uploaded images for Free Fire and eFootball, object-fit: contain)
  const gameCards = [
    {
      id: 'free_fire',
      nameAr: 'فري فاير (Free Fire)',
      nameEn: 'Free Fire',
      subtitleAr: 'شحن فوري بالمعرف ID · جواهر وعضويات وبوياه باس',
      subtitleEn: 'Instant Player ID top-up · Diamonds, Memberships & Booyah Pass',
      image: freeFireOriginalImg,
      originalPath: 'public/assets/aistudio/33ab4129a3cc0ba004d7034d34df75d1_e18e035c.jpg',
      badgeAr: 'الأكثر طلباً',
      badgeEn: 'Best Seller',
      priceRange: '50 – 1,000 MRU',
      accentColor: '#f97316',
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-950/40'
    },
    {
      id: 'efootball',
      nameAr: 'إي فوتبول (eFootball PES)',
      nameEn: 'eFootball PES',
      subtitleAr: 'إصدار لامين يامال ديلوكس 2027 · كوينز رسمية',
      subtitleEn: 'Lamine Yamal Deluxe Edition 2027 · Official Coins',
      image: efootballOriginalImg,
      originalPath: 'public/assets/aistudio/IMG_99eb4f47-d254-4ab5-b447-de06effafee0_658a16ca.jpg',
      badgeAr: 'إصدار 2027 رسمي',
      badgeEn: 'Official 2027',
      priceRange: '80 – 3,800 MRU',
      accentColor: '#06b6d4',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
    },
    {
      id: 'pubg_mobile',
      nameAr: 'ببجي موبايل (PUBG Mobile)',
      nameEn: 'PUBG Mobile',
      subtitleAr: 'شدات رسمية بالمعرف ID · رويال باس وباقات تكتيكية',
      subtitleEn: 'Official UC via Player ID · Royale Pass & Tactical Packs',
      image: pubgOriginalImg,
      originalPath: 'src/assets/images/pubg_tactical_landscape_1792944226624.jpg',
      badgeAr: 'شحن فوري',
      badgeEn: 'Instant UC',
      priceRange: '45 – 1,150 MRU',
      accentColor: '#eab308',
      badgeColor: 'border-yellow-500/40 text-yellow-400 bg-yellow-950/40'
    },
    {
      id: 'ea_sports_fc',
      nameAr: 'إي إيه إف سي (EA SPORTS FC)',
      nameEn: 'EA SPORTS FC Mobile',
      subtitleAr: 'نقاط FC موبايل الرسمية وحزم الألتيميت تيم',
      subtitleEn: 'Official FC Mobile Points & Ultimate Team Packs',
      image: eaSportsFcOriginalImg,
      originalPath: 'src/assets/images/ea_sports_fc_showcase_1792944226485.jpg',
      badgeAr: 'الموسم الجديد',
      badgeEn: 'New Season',
      priceRange: '150 – 3,500 MRU',
      accentColor: '#10b981',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
    }
  ];

  const categories = [
    { id: 'all', label: t.allCategories, icon: Sparkles },
    { id: 'free_fire', label: t.freeFire, icon: Flame },
    { id: 'pubg_mobile', label: t.pubgMobile, icon: Shield },
    { id: 'efootball', label: t.efootball, icon: Zap },
    { id: 'ea_sports_fc', label: t.eaSportsFc, icon: Zap },
    { id: 'subscriptions', label: t.otherSubscriptions, icon: KeyRound },
  ];

  const activeArtwork = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return artworks.find(a => a.gameId === selectedCategory);
  }, [selectedCategory, artworks]);

  // Image getter guaranteeing exact uploaded assets for Free Fire and eFootball
  const getProductImage = (product: Product) => {
    if (product.gameId === 'free_fire') return freeFireOriginalImg;
    if (product.gameId === 'efootball') return efootballOriginalImg;
    if (product.gameId === 'pubg_mobile') return pubgOriginalImg;
    if (product.gameId === 'ea_sports_fc') return eaSportsFcOriginalImg;
    if (product.gameId === 'subscriptions') return subscriptionsOriginalImg;
    return product.image;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameAr = p.nameAr.toLowerCase();
        const nameEn = p.nameEn.toLowerCase();
        const descAr = p.descriptionAr?.toLowerCase() || '';
        const descEn = p.descriptionEn?.toLowerCase() || '';
        return (
          nameAr.includes(query) ||
          nameEn.includes(query) ||
          descAr.includes(query) ||
          descEn.includes(query)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="catalog-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Missing Original Image Alert (Defensive check compliant with prompt instruction) */}
      {missingOriginalFiles.length > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-white text-sm mb-1">
              {language === 'ar' ? 'تنبيه: تعذر العثور على الملف الأصلي' : 'Alert: Original Image File Missing'}
            </h4>
            <p className="mb-2 text-rose-300">
              {language === 'ar' 
                ? 'الملف الأصلي المحدد أدناه مفقود، ولم يتم استبداله بأي صورة أخرى التزاماً بالمعايير:'
                : 'The following original file is missing and has NOT been substituted with another image:'}
            </p>
            <ul className="list-disc list-inside font-mono text-[11px] space-y-1">
              {missingOriginalFiles.map(path => (
                <li key={path}>{path}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{language === 'ar' ? 'الكتالوج الرسمي بالأسعار المعتمدة' : 'Official Catalog & Verified Pricing'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.gamesCatalog}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'ar'
              ? 'اختر لعبتك المفضلة أدناه لشحن الباقات مباشرة أو تصفح كافة العروض المتاحة'
              : 'Select your game below for direct package recharge or browse all verified offers'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#11151f] border border-slate-800 rounded-xl ps-9 pe-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* 1. PRIMARY GAME CARDS SHOWCASE (Preserves original aspect ratio with CSS object-fit: contain) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {language === 'ar' ? 'ألعاب المتجر المعتمدة' : 'Supported Games'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {language === 'ar' ? 'اضغط على اللعبة لعرض باقاتها' : 'Click game card to view packs'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {gameCards.map((game) => {
            const isSelected = selectedCategory === game.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(game.id);
                  const el = document.getElementById('products-section-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group text-start p-3 sm:p-4 rounded-2xl bg-[#11151f] border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden shadow-xl ${
                  isSelected 
                    ? 'border-amber-400 ring-2 ring-amber-400/20 bg-[#141a29] -translate-y-1' 
                    : 'border-white/10 hover:border-amber-500/40 hover:bg-[#141926] hover:-translate-y-0.5'
                }`}
              >
                {/* Image Frame with CSS object-fit: contain to preserve exact aspect ratio without stretching or cropping */}
                <div className="relative w-full aspect-[4/3] bg-[#07090e] rounded-xl overflow-hidden p-2 flex items-center justify-center border border-white/5 mb-3 shadow-inner">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={language === 'ar' ? game.nameAr : game.nameEn}
                      className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{ objectFit: 'contain' }}
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-3 text-center text-xs text-rose-400 font-bold">
                      {language === 'ar' ? '⚠️ ملف الصورة مفقود:' : '⚠️ Image file missing:'}
                      <div className="text-[10px] text-slate-400 font-mono mt-1 break-all">{game.originalPath}</div>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-2.5 start-2.5 z-10">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${game.badgeColor}`}>
                      {language === 'ar' ? game.badgeAr : game.badgeEn}
                    </span>
                  </div>
                </div>

                {/* Game Title & Information Underneath the Image */}
                <div className="w-full">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-extrabold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                      {language === 'ar' ? game.nameAr : game.nameEn}
                    </h4>
                    {isSelected && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {language === 'ar' ? game.subtitleAr : game.subtitleEn}
                  </p>

                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-400 font-mono">{game.priceRange}</span>
                    <span className="text-slate-400 group-hover:text-white transition-colors">
                      {language === 'ar' ? 'عرض الباقات ←' : 'View Packs →'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div id="products-section-anchor" />

      {/* Category Tabs (Segmented Button Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#121620] text-slate-400 hover:text-slate-200 hover:bg-[#181d2a] border border-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Game Spotlight Banner when category is selected */}
      {activeArtwork && (
        <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-[#10141f] via-[#141a29] to-[#0c0f17] border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            
            <div className="md:col-span-8 p-6 lg:p-8 text-start">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase tracking-wider"
                  style={{ backgroundColor: `${activeArtwork.accentColor}25`, color: activeArtwork.accentColor }}
                >
                  {activeArtwork.genre}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">SHADOW STORE OFFICIAL</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                {language === 'ar' ? activeArtwork.nameAr : activeArtwork.nameEn}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mb-4">
                {language === 'ar' ? activeArtwork.descriptionAr : activeArtwork.descriptionEn}
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t.safeRechargeNotice}</span>
                </span>
              </div>
            </div>

            {/* Spotlight Banner image - CSS object-fit: contain to preserve original aspect ratio */}
            <div className="md:col-span-4 h-52 sm:h-60 w-full overflow-hidden relative bg-[#07090e] p-3 flex items-center justify-center">
              <img
                src={
                  selectedCategory === 'free_fire'
                    ? freeFireOriginalImg
                    : selectedCategory === 'efootball'
                    ? efootballOriginalImg
                    : activeArtwork.imageUrl
                }
                alt={activeArtwork.nameEn}
                className="max-w-full max-h-full object-contain pointer-events-none"
                style={{ objectFit: 'contain' }}
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>
      )}

      {/* Delivery Method Safety Notice (when on 'all' tab) */}
      {!activeArtwork && (
        <div className="mb-8 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-amber-950/20 border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.safeRechargeNotice}</span>
          </div>
          <span className="text-amber-400 font-bold shrink-0 hidden sm:inline font-mono">
            {language === 'ar' ? 'الرقم المعتمد: 31520844' : 'Payment # 31520844'}
          </span>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#10131b] rounded-2xl border border-slate-800/60">
          <p className="text-slate-400 text-sm mb-2">
            {language === 'ar' ? 'لا توجد منتجات مطابقة لبحثك حالياً' : 'No products found matching your search'}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-amber-400 text-xs font-bold hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'عرض جميع المنتجات' : 'View all products'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => {
            const isPlayerId = product.deliveryMethod === 'player_id';
            const title = language === 'ar' ? product.nameAr : product.nameEn;
            const desc = language === 'ar' ? product.descriptionAr : product.descriptionEn;
            const productImage = getProductImage(product);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-[#11151f] hover:bg-[#141926] rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg shadow-black/40"
              >
                {/* Artwork Top - Preserving aspect ratio with CSS object-fit: contain, no cropping or stretching */}
                <div className="relative h-44 w-full bg-[#07090e] p-2 flex items-center justify-center overflow-hidden border-b border-white/5">
                  <img
                    src={productImage}
                    alt={title}
                    className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ objectFit: 'contain' }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Delivery Tag on artwork */}
                  <div className="absolute top-3 start-3 z-10">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md ${
                      isPlayerId 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isPlayerId ? <UserCheck className="w-3 h-3" /> : <KeyRound className="w-3 h-3" />}
                      <span>{isPlayerId ? t.viaPlayerId : t.viaAccount}</span>
                    </span>
                  </div>

                  {/* Optional promo badge */}
                  {product.badge && (
                    <div className="absolute top-3 end-3 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-600 text-white uppercase tracking-wider shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body - Game and Product Name displayed clearly underneath */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base mb-1.5 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {desc}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-amber-400 font-mono tabular-nums">
                          {product.priceMru}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {language === 'ar' ? 'أوقية' : 'MRU'}
                        </span>
                      </div>
                      {product.originalPriceMru && (
                        <span className="text-xs text-slate-500 line-through tabular-nums">
                          {product.originalPriceMru} MRU
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      disabled={!product.isAvailable}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        product.isAvailable
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.isAvailable ? t.rechargeNow : (language === 'ar' ? 'غير متاح' : 'Sold Out')}</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
