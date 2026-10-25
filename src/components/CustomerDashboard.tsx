import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import type { Order } from '../types/index.ts';
import { User, Phone, Mail, Gamepad2, ShoppingBag, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface CustomerDashboardProps {
  onTrackOrder: (orderRef: string, pin: string) => void;
}

export function CustomerDashboard({ onTrackOrder }: CustomerDashboardProps) {
  const { t, language, formatCurrency, getStatusLabel, getStatusColor } = useLanguage();
  const { user, token, savedPlayerIds, savePlayerId } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable player IDs
  const [ffId, setFfId] = useState(savedPlayerIds['free_fire'] || '');
  const [pubgId, setPubgId] = useState(savedPlayerIds['pubg_mobile'] || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(err => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSaveIds = (e: React.FormEvent) => {
    e.preventDefault();
    if (ffId) savePlayerId('free_fire', ffId.trim());
    if (pubgId) savePlayerId('pubg_mobile', pubgId.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>{language === 'ar' ? 'يرجى تسجيل الدخول لعرض حسابك' : 'Please sign in to view your dashboard'}</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* User Profile Card */}
      <div className="p-6 rounded-2xl bg-[#11151f] border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{user.fullName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.email}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.phone}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-start sm:text-end">
          <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
            {language === 'ar' ? 'عضوية SHADOW STORE' : 'Member Status'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {user.role === 'admin' ? 'مدير المتجر' : 'عميل مميز'}
          </span>
        </div>
      </div>

      {/* Grid: Saved Player IDs + Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Saved Player IDs (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#11151f] border border-slate-800 shadow-xl">
          <h3 className="font-extrabold text-white text-sm mb-2 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'معرفات اللاعبين المحفوظة' : 'Saved Player IDs'}</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {language === 'ar' ? 'احفظ آيديات ألعابك لتعبئتها تلقائياً عند الشحن' : 'Save your IDs for one-click checkout'}
          </p>

          <form onSubmit={handleSaveIds} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t.freeFire} (Player ID)
              </label>
              <input
                type="text"
                value={ffId}
                onChange={(e) => setFfId(e.target.value)}
                placeholder="Free Fire ID..."
                className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t.pubgMobile} (Character ID)
              </label>
              <input
                type="text"
                value={pubgId}
                onChange={(e) => setPubgId(e.target.value)}
                placeholder="PUBG Character ID..."
                className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono"
              />
            </div>

            {saveSuccess && (
              <p className="text-xs text-emerald-400 font-bold">
                {language === 'ar' ? 'تم حفظ المعرفات بنجاح!' : 'IDs saved!'}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-xl text-xs font-bold bg-[#191f2c] text-amber-400 hover:bg-[#202738] border border-amber-500/30 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'تحديث المعرفات' : 'Save IDs'}
            </button>
          </form>
        </div>

        {/* Customer Order History (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#11151f] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{t.myOrders}</span>
            </h3>
            <span className="text-xs text-slate-400 tabular-nums">
              {orders.length} {language === 'ar' ? 'طلبات' : 'orders'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {language === 'ar' ? 'جارٍ تحميل سجل الطلبات...' : 'Loading orders...'}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-[#141824] rounded-xl border border-white/5">
              <p className="mb-1">{t.emptyCart}</p>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'لم تقم بإنشاء أي طلب بعد بهذا الحساب' : 'You haven’t placed any orders yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => {
                const color = getStatusColor(ord.status);
                return (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-xl bg-[#141824] border border-white/5 flex flex-wrap items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          {ord.orderRef}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color.bg} ${color.text} ${color.border}`}>
                          {getStatusLabel(ord.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {ord.items.map(i => language === 'ar' ? i.productNameAr : i.productNameEn).join(' + ')}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString()} · {ord.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-amber-400 text-sm tabular-nums">
                        {ord.totalMru} MRU
                      </span>
                      <button
                        onClick={() => onTrackOrder(ord.orderRef, ord.verificationPin)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1b2230] text-slate-300 hover:text-white hover:bg-[#232c3f] border border-slate-700 cursor-pointer"
                      >
                        {t.trackOrder}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
