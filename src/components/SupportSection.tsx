import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { 
  MessageSquare, 
  Clock, 
  PhoneCall, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';

export function SupportSection() {
  const { t, language } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [ticketCreatedRef, setTicketCreatedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const whatsappNumber = '+22231520844';
  const whatsappUrl = `https://wa.me/22231520844?text=${encodeURIComponent(
    language === 'ar'
      ? 'مرحباً بخدمة عملاء SHADOW STORE، أحتاج إلى مساعدة بخصوص شحن الألعاب.'
      : 'Hello SHADOW STORE Support, I need assistance with my game recharge.'
  )}`;

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderRef: orderRef || undefined,
          subject,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      setTicketCreatedRef(data.ticketRef);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error submitting ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>{language === 'ar' ? 'فريق الدعم الفني في خدمتك' : 'Customer Care Team'}</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">
          {t.customerSupport}
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          {language === 'ar'
            ? 'نحن هنا لمساعدتك في أي استفسار حول شحن فري فاير، ببجي، إي فوتبول أو التحويلات البنكية عبر بنكيلي ومصريفي وسداد.'
            : 'We are here to assist you with Free Fire, PUBG, eFootball recharges or Bankily, Masrivi, and Sedad transfers.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Info Cards (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Direct WhatsApp Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121c17] to-[#0e1411] border border-emerald-500/30 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {t.directWhatsApp}
                </h3>
                <p className="text-xs text-emerald-400 font-mono font-bold">+222 31520844</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {language === 'ar'
                ? 'تواصل مباشرة مع المشرف عبر واتساب للاستفسارات السريعة أو إرسال وصل التحويل اليدوي.'
                : 'Chat directly with our store support on WhatsApp for quick inquiries or manual receipt verification.'}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25"
            >
              <span>{language === 'ar' ? 'فتح محادثة واتساب' : 'Open WhatsApp Chat'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Business Hours Card */}
          <div className="p-5 rounded-2xl bg-[#11151f] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Clock className="w-4 h-4" />
              <span>{t.businessHours}</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {language === 'ar' 
                ? 'يومياً من 09:00 صباحاً حتى 02:00 فجراً بتوقيت موريتانيا (GMT)' 
                : 'Daily from 09:00 AM to 02:00 AM GMT (Mauritania time)'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'ar' ? 'يتم الرد والتنفيذ خلال 2–10 دقائق خلال أوقات العمل الرسمية.' : 'Replies & fulfillment within 2–10 minutes during working hours.'}
            </p>
          </div>

          {/* Security & Authenticity Card */}
          <div className="p-5 rounded-2xl bg-[#11151f] border border-slate-800 shadow-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'أمان وسرية تامة' : 'Security & Privacy'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'لا نطلب أبداً كلمات سر حساباتكم للشحن عبر الـ ID. احذر من أي شخص يطلب منك ذلك باسم المتجر.'
                : 'We never request your game account password for Player ID top-ups.'}
            </p>
          </div>

        </div>

        {/* Right Ticket Form (7 cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-[#11151f] border border-amber-500/20 shadow-xl">
          <h3 className="font-extrabold text-white text-base mb-1">
            {language === 'ar' ? 'فتح تذكرة دعم فني جديدة' : 'Submit a Support Ticket'}
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            {language === 'ar' 
              ? 'أرسل تفاصيل مشكلتك أو طلبك وسيصلك الرد مباشرة' 
              : 'Submit your query and our team will get back to you promptly.'}
          </p>

          {ticketCreatedRef ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-extrabold text-white">
                {t.ticketSuccess}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'ar' ? 'رقم التذكرة الخاص بك:' : 'Your Ticket Reference:'}
              </p>
              <span className="inline-block px-3 py-1.5 rounded-lg bg-[#141926] font-mono font-black text-amber-400 text-sm">
                {ticketCreatedRef}
              </span>
              <div className="pt-2">
                <button
                  onClick={() => setTicketCreatedRef(null)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {language === 'ar' ? 'إرسال استفسار آخر' : 'Submit another ticket'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                    className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="3X XX XX XX"
                    className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.ticketSubject} *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={language === 'ar' ? 'استفسار عن تحويل بنكيلي / طلب فري فاير' : 'e.g. Bankily transfer inquiry'}
                    className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    {t.orderReference} ({language === 'ar' ? 'إن وجد' : 'Optional'})
                  </label>
                  <input
                    type="text"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    placeholder="SHW-XXXXXX"
                    className="w-full bg-[#161a25] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t.ticketMessage} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب تفاصيل استفسارك أو مشكلتك هنا...' : 'Type your message or inquiry here...'}
                  className="w-full bg-[#161a25] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-bold">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? '...' : t.sendTicket}</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </section>
  );
}
