import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Order, OrderStatusHistoryItem, OrderStatus } from '../types/index.ts';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  ExternalLink, 
  Upload, 
  Check, 
  Copy,
  UserCheck
} from 'lucide-react';

interface OrderTrackerProps {
  initialOrderRef?: string;
  initialPin?: string;
}

export function OrderTracker({ initialOrderRef = '', initialPin = '' }: OrderTrackerProps) {
  const { t, language, formatCurrency, getStatusLabel, getStatusColor } = useLanguage();

  const [orderRef, setOrderRef] = useState(initialOrderRef);
  const [verificationFactor, setVerificationFactor] = useState(initialPin);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderStatusHistoryItem[]>([]);

  // Update proof state
  const [newProofUrl, setNewProofUrl] = useState<string>('');
  const [proofTxRef, setProofTxRef] = useState('');
  const [proofSuccess, setProofSuccess] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);

  // Auto-search if initial parameters are provided
  React.useEffect(() => {
    if (initialOrderRef && initialPin) {
      handleTrack(initialOrderRef, initialPin);
    }
  }, [initialOrderRef, initialPin]);

  const handleTrack = async (ref = orderRef, factor = verificationFactor) => {
    if (!ref.trim() || !factor.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال رقم الطلب وعامل التحقق' : 'Please provide Order Ref and verification factor');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: ref.trim(),
          verificationFactor: factor.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.orderNotFound);
      }

      setTrackedOrder(data.order);
      setHistory(data.history || []);
    } catch (err: any) {
      setTrackedOrder(null);
      setError(err.message || t.orderNotFound);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProofUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpdatedProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackedOrder) return;
    setProofLoading(true);

    try {
      const res = await fetch(`/api/orders/${trackedOrder.orderRef}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationFactor,
          paymentProofUrl: newProofUrl || undefined,
          paymentTxRef: proofTxRef || undefined
        })
      });

      if (res.ok) {
        setProofSuccess(true);
        setTimeout(() => setProofSuccess(false), 4000);
        // Refresh tracking details
        handleTrack();
      }
    } catch (e) {
      console.error('Failed to update proof:', e);
    } finally {
      setProofLoading(false);
    }
  };

  // Helper for Stepper stages
  const getStepState = (status: OrderStatus, stepIndex: number) => {
    // 0: Placed, 1: Review, 2: In Progress, 3: Completed
    if (status === 'completed') return 'completed';
    if (status === 'rejected' || status === 'cancelled') {
      return stepIndex === 0 ? 'completed' : 'failed';
    }
    if (status === 'in_progress') {
      if (stepIndex <= 2) return 'completed';
      return 'pending';
    }
    if (status === 'awaiting_payment' || status === 'needs_review') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'active';
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-2">
          {t.trackOrder}
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          {t.verificationFactorHelp}
        </p>
      </div>

      {/* Tracker Search Box */}
      <div className="p-6 bg-[#11151f] rounded-2xl border border-amber-500/20 shadow-xl mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4"
        >
          {/* Order Ref Input */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t.orderReference}
            </label>
            <input
              type="text"
              required
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="SHW-XXXXXX"
              className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono font-bold uppercase placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* PIN or Phone Factor */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t.verificationFactor}
            </label>
            <input
              type="text"
              required
              value={verificationFactor}
              onChange={(e) => setVerificationFactor(e.target.value)}
              placeholder={language === 'ar' ? 'رمز PIN المكون من 4 أرقام أو رقم الهاتف' : '4-digit PIN or phone number'}
              className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Search CTA */}
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? '...' : (language === 'ar' ? 'بحث' : 'Track')}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracked Order Result Card */}
      {trackedOrder && (
        <div className="bg-[#11151f] rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl animate-fade-in">
          
          {/* Header Card */}
          <div className="p-6 bg-[#141926] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl font-mono font-black text-amber-400">
                  {trackedOrder.orderRef}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(trackedOrder.status).bg} ${getStatusColor(trackedOrder.status).text} ${getStatusColor(trackedOrder.status).border}`}>
                  {getStatusLabel(trackedOrder.status)}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {new Date(trackedOrder.createdAt).toLocaleString(language === 'ar' ? 'ar-MR' : 'en-US')}
              </p>
            </div>

            {/* WhatsApp escalation button */}
            <a
              href={`https://wa.me/22231520844?text=${encodeURIComponent(
                language === 'ar'
                  ? `مرحباً، أستفسر عن طلبي رقم ${trackedOrder.orderRef}`
                  : `Hello, inquiring regarding my order ${trackedOrder.orderRef}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.directWhatsApp}</span>
            </a>
          </div>

          {/* Stepper Visualization */}
          <div className="p-6 border-b border-white/5 bg-[#0f121a]">
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: language === 'ar' ? 'تم تسجيل الطلب' : 'Order Placed', icon: Clock },
                { label: language === 'ar' ? 'مراجعة التحويل' : 'Payment Review', icon: ShieldCheck },
                { label: language === 'ar' ? 'قيد الشحن' : 'In Progress', icon: UserCheck },
                { label: language === 'ar' ? 'مكتمل' : 'Completed', icon: CheckCircle },
              ].map((step, idx) => {
                const Icon = step.icon;
                const state = getStepState(trackedOrder.status, idx);

                let dotStyle = 'bg-slate-800 text-slate-500 border-slate-700';
                if (state === 'completed') {
                  dotStyle = 'bg-emerald-500 text-black border-emerald-400 font-bold';
                } else if (state === 'active') {
                  dotStyle = 'bg-amber-500 text-black border-amber-300 font-bold animate-pulse';
                } else if (state === 'failed') {
                  dotStyle = 'bg-rose-500 text-white border-rose-400';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${dotStyle}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 max-w-[80px]">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Product & Player Details */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {language === 'ar' ? 'بيانات الشحن' : 'Recharge Details'}
              </h4>

              <div className="p-4 rounded-xl bg-[#141824] border border-white/5 space-y-2.5 text-xs">
                {trackedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-white">
                        {language === 'ar' ? item.productNameAr : item.productNameEn}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {item.deliveryMethod === 'player_id' ? t.viaPlayerId : t.viaAccount}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-400 tabular-nums">
                      {item.priceMru} MRU
                    </span>
                  </div>
                ))}

                {trackedOrder.playerId && (
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">{t.playerIdLabel}:</span>
                    <span className="font-mono font-bold text-emerald-400">{trackedOrder.playerId}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="font-bold text-slate-300">{t.total}:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">{trackedOrder.totalMru} MRU</span>
                </div>
              </div>
            </div>

            {/* Right: Payment & Status Updates */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {language === 'ar' ? 'حالة الدفع والملاحظات' : 'Payment & Status Notes'}
              </h4>

              <div className="p-4 rounded-xl bg-[#141824] border border-white/5 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{language === 'ar' ? 'طريقة التحويل:' : 'Method:'}</span>
                  <span className="font-bold text-slate-200 uppercase">{trackedOrder.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">{t.senderPhone}:</span>
                  <span className="font-mono text-slate-200">{trackedOrder.paymentPhone || '—'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">{t.transactionRef}:</span>
                  <span className="font-mono text-slate-200">{trackedOrder.paymentTxRef || '—'}</span>
                </div>

                {/* Admin notes if any */}
                {trackedOrder.adminNotes && (
                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/20 text-amber-300 mt-2">
                    <span className="font-bold block mb-0.5">{t.adminNotes}:</span>
                    <p className="text-[11px] leading-relaxed">{trackedOrder.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Order Status History Timeline */}
          {history.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-[#0e1118]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {language === 'ar' ? 'سجل تحديثات الطلب' : 'Status Updates Log'}
              </h4>

              <div className="space-y-3">
                {history.map((hist) => (
                  <div key={hist.id} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          {getStatusLabel(hist.newStatus)}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(hist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {hist.reason && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{hist.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Proof Uploader Section */}
          {!trackedOrder.paymentProofUrl && (trackedOrder.status === 'awaiting_payment' || trackedOrder.status === 'needs_review') && (
            <div className="p-6 border-t border-amber-500/20 bg-[#151926]">
              <h4 className="text-xs font-bold text-amber-400 mb-2">
                {language === 'ar' ? 'هل قمت بالتحويل وترغب برفع الوصل الآن؟' : 'Did you complete payment and want to upload proof?'}
              </h4>
              
              <form onSubmit={handleSubmitUpdatedProof} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={proofTxRef}
                    onChange={(e) => setProofTxRef(e.target.value)}
                    placeholder={language === 'ar' ? 'رقم العملية البنكية' : 'Bank transaction reference'}
                    className="bg-[#121622] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadProof}
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-bold cursor-pointer"
                  />
                </div>

                {proofSuccess && (
                  <p className="text-xs text-emerald-400 font-bold">
                    {language === 'ar' ? 'تم إرسال إثبات الدفع بنجاح للإدارة!' : 'Payment proof submitted to staff!'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={proofLoading || (!newProofUrl && !proofTxRef)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {proofLoading ? '...' : (language === 'ar' ? 'إرسال وصل الدفع' : 'Submit Proof')}
                </button>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
