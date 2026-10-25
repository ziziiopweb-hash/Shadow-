import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import type { Product, Order, PaymentMethodType } from '../types/index.ts';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  Upload, 
  AlertTriangle, 
  User, 
  Phone, 
  Gamepad2, 
  Lock, 
  CreditCard,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export function CheckoutModal({ product, onClose, onOrderCreated }: CheckoutModalProps) {
  const { t, language, dir, formatCurrency } = useLanguage();
  const { user, savedPlayerIds, savePlayerId } = useAuth();

  const [step, setStep] = useState<'details' | 'payment'>('details');

  // Customer Form State
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [playerId, setPlayerId] = useState(() => savedPlayerIds[product.gameId] || '');
  const [saveIdChecked, setSaveIdChecked] = useState(true);
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bankily');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentNumber = '31520844';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError(language === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 8 ميجابايت)' : 'File size too large (max 8MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال اسمك ورقم الهاتف' : 'Please provide your name and phone number');
      return;
    }

    if (product.deliveryMethod === 'player_id' && !playerId.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال معرف اللاعب (Player ID)' : 'Please enter your Player ID');
      return;
    }

    if (product.deliveryMethod === 'account_login' && (!accountEmail.trim() || !accountPassword.trim())) {
      setError(language === 'ar' ? 'يرجى إدخال بيانات حساب اللعبة' : 'Please provide game account email and password');
      return;
    }

    if (saveIdChecked && playerId.trim()) {
      savePlayerId(product.gameId, playerId.trim());
    }

    setError(null);
    setStep('payment');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        customerName,
        customerPhone,
        playerId: product.deliveryMethod === 'player_id' ? playerId : undefined,
        accountEmail: product.deliveryMethod === 'account_login' ? accountEmail : undefined,
        accountPassword: product.deliveryMethod === 'account_login' ? accountPassword : undefined,
        deliveryMethod: product.deliveryMethod,
        items: [{ productId: product.id, quantity: 1 }],
        paymentMethod,
        paymentPhone: senderPhone,
        paymentTxRef: transactionRef,
        paymentProofUrl: paymentProofUrl || undefined,
        customerNotes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('shadow_store_token')}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (language === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'Failed to create order'));
      }

      onOrderCreated(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#11151f] rounded-2xl border border-amber-500/25 shadow-2xl shadow-black overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#141926]">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">
              {step === 'details' ? t.customerDetails : t.checkout}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product summary banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/20 via-[#131722] to-amber-950/20 border-b border-white/5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">
              {language === 'ar' ? product.nameAr : product.nameEn}
            </p>
            <p className="text-xs text-amber-400/90 font-medium">
              {product.deliveryMethod === 'player_id' ? t.viaPlayerId : t.viaAccount}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-amber-400 font-mono tabular-nums">
              {product.priceMru}
            </span>
            <span className="text-xs text-slate-400 ms-1">
              {language === 'ar' ? 'أوقية' : 'MRU'}
            </span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Customer & Game Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-5 space-y-4">
            
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.fullName} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'ar' ? 'محمد المختار' : 'Mohamed El Mokhtar'}
                  className="w-full bg-[#161a25] border border-slate-700/80 rounded-xl ps-9 pe-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.phoneNumber} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="3X XX XX XX"
                  className="w-full bg-[#161a25] border border-slate-700/80 rounded-xl ps-9 pe-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            </div>

            {/* If ID-based top-up */}
            {product.deliveryMethod === 'player_id' ? (
              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1.5">
                  {t.playerIdLabel} *
                </label>
                <div className="relative">
                  <Gamepad2 className="w-4 h-4 text-amber-500 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل الآيدي (مثال: 184920482)' : 'e.g. 184920482'}
                    className="w-full bg-[#161a25] border border-amber-500/40 rounded-xl ps-9 pe-4 py-2.5 text-sm text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="saveId"
                    checked={saveIdChecked}
                    onChange={(e) => setSaveIdChecked(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="saveId" className="text-xs text-slate-400 cursor-pointer">
                    {t.saveId}
                  </label>
                </div>
              </div>
            ) : (
              // Account-based delivery (clearly distinguished with safety warnings)
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span>{language === 'ar' ? 'شحن عبر الحساب (مشفر ومحمي)' : 'Account-Based Delivery (Encrypted)'}</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.accountEmailLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="example@gmail.com / +222..."
                    className="w-full bg-[#161a25] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.accountPasswordLabel} *
                  </label>
                  <input
                    type="password"
                    required
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#161a25] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {language === 'ar' 
                    ? 'بياناتك مشفرة ولا يتم استخدامها إلا لغرض تفعيل الباقة المطلوبة فقط من قبل المشرف.' 
                    : 'Your credentials are encrypted and only used once by store staff to apply the selected package.'}
                </p>
              </div>
            )}

            {/* Customer Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {language === 'ar' ? 'ملاحظة إضافية (اختياري)' : 'Additional Notes (Optional)'}
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder={language === 'ar' ? 'اسم اللاعب داخل اللعبة أو ملاحظة خاصة...' : 'In-game nickname or notes...'}
                className="w-full bg-[#161a25] border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-200"
              />
            </div>

            {/* Next Button */}
            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{language === 'ar' ? 'المتابعة لاختيار طريقة الدفع' : 'Proceed to Payment'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </form>
        )}

        {/* Step 2: Payment Verification & Proof */}
        {step === 'payment' && (
          <form onSubmit={handleSubmitOrder} className="p-5 space-y-5">
            
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {t.paymentMethodSelect}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'bankily', name: 'بنكيلي (Bankily)', color: 'border-emerald-500/50' },
                  { id: 'masrivi', name: 'مصريفي (Masrivi)', color: 'border-amber-500/50' },
                  { id: 'sedad', name: 'سداد (Sedad)', color: 'border-orange-500/50' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethodType)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === method.id
                        ? `bg-amber-500/15 ${method.color} border-2 text-amber-300 font-bold`
                        : 'bg-[#151924] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-extrabold">{method.name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-75">{method.name.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Official Mauritanian Payment Number Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#151926] to-amber-950/40 border border-amber-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-300">
                  {t.officialNumber}:
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>

              <div className="text-2xl font-black text-amber-400 font-mono tracking-widest text-center py-1">
                {paymentNumber}
              </div>

              <div className="mt-2 text-center text-[11px] text-slate-300 font-medium">
                {language === 'ar' 
                  ? `قم بتحويل مبلغ ${product.priceMru} أوقية جديدة إلى الرقم أعلاه عبر تطبيق ${t[paymentMethod]}`
                  : `Transfer ${product.priceMru} MRU to the number above via ${t[paymentMethod]}`}
              </div>
            </div>

            {/* Sender Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.senderPhone} *
              </label>
              <input
                type="tel"
                required
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="3X XX XX XX"
                className="w-full bg-[#161a25] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Transaction Reference / Note */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.transactionRef} (أو كود الإشعار)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="مثال: REF-92841 أو رقم رسالة البنك"
                className="w-full bg-[#161a25] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Proof Screenshot Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.uploadProof} (وصل الدفع)
              </label>
              
              <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-3 text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {paymentProofUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <img 
                      src={paymentProofUrl} 
                      alt="Proof" 
                      className="w-12 h-12 object-cover rounded-lg border border-amber-500/50" 
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-400">
                        {language === 'ar' ? 'تم اختيار صورة الوصل بنجاح' : 'Receipt image attached'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? 'انقر لتغيير الصورة' : 'Click to replace image'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-2">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-300">
                      {language === 'ar' ? 'اضغط لرفع لقطة الشاشة للتحويل' : 'Click or tap to upload receipt'}
                    </span>
                    <span className="text-[10px] text-slate-500">PNG, JPG (Max 8MB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Disclosure (Anti-Slop rule: real fulfillment transparency) */}
            <div className="p-3 rounded-xl bg-[#0e121a] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-bold">🔒 سياسة التحقق:</span>{' '}
              {language === 'ar'
                ? 'يتم فحص ومراجعة عملية التحويل فوراً ومطابقتها مع كشف حساب المحفظة البنكية، ثم يتم تنفيذ الشحن فوراً.'
                : 'All payments are verified against the official ledger before manual fulfillment by store operators.'}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-3 rounded-xl text-xs font-bold bg-[#171b26] text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              >
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="animate-spin text-black font-bold">⏳</span>
                ) : (
                  <ShieldCheck className="w-4 h-4 fill-black" />
                )}
                <span>{loading ? (language === 'ar' ? 'جارٍ الحفظ...' : 'Processing...') : t.confirmOrder}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
