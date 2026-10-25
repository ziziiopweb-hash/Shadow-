import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Order } from '../types/index.ts';
import { CheckCircle2, Copy, Check, MessageSquare, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
  onTrackOrder: (orderRef: string, pin: string) => void;
}

export function OrderSuccessModal({ order, onClose, onTrackOrder }: OrderSuccessModalProps) {
  const { t, language, dir, formatCurrency } = useLanguage();
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(order.orderRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const copyPin = () => {
    navigator.clipboard.writeText(order.verificationPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    language === 'ar'
      ? `مرحباً متجر SHADOW STORE، قمت بإنشاء الطلب رقم: ${order.orderRef} بمبلغ ${order.totalMru} أوقية عبر ${order.paymentMethod}. معرف اللاعب: ${order.playerId || 'حساب'}. أرجو المتابعة.`
      : `Hello SHADOW STORE, I placed order ${order.orderRef} for ${order.totalMru} MRU via ${order.paymentMethod}. Player ID: ${order.playerId || 'Account'}. Please process.`
  );

  const whatsappUrl = `https://wa.me/22231520844?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#11151f] rounded-2xl border border-amber-500/40 shadow-2xl p-6 text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-xl font-black text-white mb-2">
          {t.orderCreatedSuccess}
        </h3>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          {t.keepPinSafe}
        </p>

        {/* Order Reference and PIN Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          
          {/* Order Ref */}
          <div className="p-3.5 rounded-xl bg-[#151a26] border border-amber-500/20 text-start">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {t.orderReference}
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-amber-400 text-base">
                {order.orderRef}
              </span>
              <button 
                onClick={copyRef} 
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                title="Copy"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security PIN */}
          <div className="p-3.5 rounded-xl bg-[#151a26] border border-amber-500/20 text-start">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              رمز الأمان (PIN)
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-emerald-400 text-base">
                {order.verificationPin}
              </span>
              <button 
                onClick={copyPin} 
                className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                title="Copy"
              >
                {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* Order Details Summary */}
        <div className="p-3 rounded-xl bg-[#0d1017] border border-white/5 text-xs text-slate-300 space-y-1.5 mb-6 text-start">
          <div className="flex justify-between">
            <span className="text-slate-400">{t.total}:</span>
            <span className="font-bold text-amber-400 font-mono">{order.totalMru} MRU</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
            <span className="font-bold text-slate-200 uppercase">{order.paymentMethod}</span>
          </div>
          {order.playerId && (
            <div className="flex justify-between">
              <span className="text-slate-400">{t.playerIdLabel}:</span>
              <span className="font-mono font-bold text-amber-300">{order.playerId}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Direct WhatsApp Confirmation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.directWhatsApp} (+222 31520844)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Jump to Track Order */}
          <button
            onClick={() => {
              onTrackOrder(order.orderRef, order.verificationPin);
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>{t.trackButton}</span>
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}
