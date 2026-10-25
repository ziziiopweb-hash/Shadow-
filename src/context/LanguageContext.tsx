import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, OrderStatus, DeliveryMethod, PaymentMethodType } from '../types/index.ts';

interface Translations {
  storeName: string;
  tagline: string;
  pillars: string;
  rechargeNow: string;
  trackOrder: string;
  gamesCatalog: string;
  subscriptions: string;
  searchPlaceholder: string;
  allCategories: string;
  freeFire: string;
  pubgMobile: string;
  efootball: string;
  eaSportsFc: string;
  otherSubscriptions: string;
  officialNumber: string;
  paymentNotice: string;
  viaPlayerId: string;
  viaAccount: string;
  orderReference: string;
  verificationFactor: string;
  verificationFactorHelp: string;
  trackButton: string;
  orderNotFound: string;
  customerSupport: string;
  businessHours: string;
  directWhatsApp: string;
  ticketSubject: string;
  ticketMessage: string;
  sendTicket: string;
  ticketSuccess: string;
  login: string;
  register: string;
  myAccount: string;
  adminDashboard: string;
  logout: string;
  cart: string;
  emptyCart: string;
  checkout: string;
  total: string;
  mru: string;
  customerDetails: string;
  fullName: string;
  phoneNumber: string;
  playerIdLabel: string;
  accountEmailLabel: string;
  accountPasswordLabel: string;
  paymentMethodSelect: string;
  bankily: string;
  masrivi: string;
  sedad: string;
  transferProof: string;
  uploadProof: string;
  senderPhone: string;
  transactionRef: string;
  confirmOrder: string;
  orderCreatedSuccess: string;
  keepPinSafe: string;
  viewOrder: string;
  statusAwaitingPayment: string;
  statusInProgress: string;
  statusCompleted: string;
  statusRejected: string;
  statusCancelled: string;
  statusNeedsReview: string;
  safeRechargeNotice: string;
  adminNotes: string;
  orderDate: string;
  saveId: string;
  myOrders: string;
  navHome: string;
  navGames: string;
  navTrack: string;
  navSupport: string;
  navAccount: string;
  adminOrders: string;
  adminProducts: string;
  adminAnnouncements: string;
  adminTickets: string;
  adminLogs: string;
  adminSettings: string;
  revenue: string;
  pendingReviews: string;
  changeStatus: string;
}

const translationsAr: Translations = {
  storeName: 'SHADOW STORE',
  tagline: 'SHADOW STORE — هو خيارك الأمثل',
  pillars: 'سرعة ⚡ أمانة 🔐 ثقة 💯',
  rechargeNow: 'ابدأ الشحن',
  trackOrder: 'تتبع طلبي',
  gamesCatalog: 'كتالوج الألعاب',
  subscriptions: 'الاشتراكات الرقمية',
  searchPlaceholder: 'ابحث عن لعبتك أو الباقة المطلوبة...',
  allCategories: 'جميع الألعاب',
  freeFire: 'فري فاير (Free Fire)',
  pubgMobile: 'ببجي موبايل (PUBG)',
  efootball: 'إي فوتبول (eFootball)',
  eaSportsFc: 'إي إيه إف سي (EA FC)',
  otherSubscriptions: 'اشتراكات وبطاقات',
  officialNumber: 'رقم الدفع المعتمد في موريتانيا',
  paymentNotice: 'يرجى تحويل المبلغ بالكامل إلى الرقم المعتمد وإرفاق الوصل أو رقم العملية',
  viaPlayerId: 'عبر المعرف (ID)',
  viaAccount: 'عبر الحساب',
  orderReference: 'رقم الطلب',
  verificationFactor: 'عامل التحقق (PIN أو رقم الهاتف)',
  verificationFactorHelp: 'أدخل رمز الـ PIN المكون من 4 أرقام أو رقم هاتفك الذي استخدمته في الطلب',
  trackButton: 'تتبع الطلب الآن',
  orderNotFound: 'لم يتم العثور على طلب مطابق للبيانات المدخلة',
  customerSupport: 'خدمة العملاء والدعم الفني',
  businessHours: 'ساعات العمل الرسمية',
  directWhatsApp: 'تواصل فوري عبر واتساب',
  ticketSubject: 'موضوع الاستفسار',
  ticketMessage: 'نص الرسالة أو تفاصيل الطلب',
  sendTicket: 'إرسال التذكرة',
  ticketSuccess: 'تم إرسال تذكرتك بنجاح وسيتم الرد عليك في أقرب وقت',
  login: 'تسجيل الدخول',
  register: 'إنشاء حساب جديد',
  myAccount: 'حسابي',
  adminDashboard: 'لوحة الإدارة',
  logout: 'تسجيل الخروج',
  cart: 'سلة الشحن',
  emptyCart: 'سلتك فارغة حالياً',
  checkout: 'إتمام الطلب والدفع',
  total: 'الإجمالي',
  mru: 'أوقية جديدة (MRU)',
  customerDetails: 'بيانات المستلم واللاعب',
  fullName: 'الاسم الكامل',
  phoneNumber: 'رقم الهاتف (الواتساب)',
  playerIdLabel: 'معرف اللاعب (Player ID)',
  accountEmailLabel: 'بريد أو رقم حساب اللعبة',
  accountPasswordLabel: 'كلمة مرور حساب اللعبة (مشفرة)',
  paymentMethodSelect: 'اختر طريقة الدفع الموريتانية',
  bankily: 'بنكيلي (Bankily)',
  masrivi: 'مصريفي (Masrivi)',
  sedad: 'سداد (Sedad)',
  transferProof: 'إثبات التحويل',
  uploadProof: 'رفع صورة إشعار التحويل',
  senderPhone: 'رقم هاتف المرسل (المحول منه)',
  transactionRef: 'رقم العملية / الإشعار البنكي',
  confirmOrder: 'تأكيد الطلب وإرسال التحويل',
  orderCreatedSuccess: 'تم تسجيل طلبك بنجاح في متجر شادو ستور!',
  keepPinSafe: 'احتفظ برقم الطلب ورمز PIN لتتبع حالته في أي وقت:',
  viewOrder: 'عرض تفاصيل الطلب',
  statusAwaitingPayment: 'في انتظار الدفع / المراجعة',
  statusInProgress: 'قيد التنفيذ',
  statusCompleted: 'تم الشحن بنجاح (مكتمل)',
  statusRejected: 'مرفوض',
  statusCancelled: 'ملغى',
  statusNeedsReview: 'يحتاج مراجعة إضافية',
  safeRechargeNotice: 'نظام شحن رسمي وموثوق 100%. الشحن عبر الـ ID لا يتطلب أبداً كلمة المرور.',
  adminNotes: 'ملاحظات الإدارة',
  orderDate: 'تاريخ ووقت الطلب',
  saveId: 'حفظ هذا المعرف لطلباتك القادمة',
  myOrders: 'سجل طلباتي السابقة',
  navHome: 'الرئيسية',
  navGames: 'الألعاب والأسعار',
  navTrack: 'تتبع طلبي',
  navSupport: 'الدعم والمساعدة',
  navAccount: 'حسابي',
  adminOrders: 'إدارة الطلبات',
  adminProducts: 'المنتجات والأسعار',
  adminAnnouncements: 'الإعلانات والتنبيهات',
  adminTickets: 'تذاكر الدعم',
  adminLogs: 'سجل النشاطات والأمان',
  adminSettings: 'إعدادات المتجر',
  revenue: 'إجمالي المبيعات المؤكدة',
  pendingReviews: 'طلبات تنتظر المراجعة',
  changeStatus: 'تحديث حالة الطلب'
};

const translationsEn: Translations = {
  storeName: 'SHADOW STORE',
  tagline: 'SHADOW STORE — Your Ultimate Gaming Vault',
  pillars: 'Speed ⚡ Integrity 🔐 Trust 💯',
  rechargeNow: 'Recharge Now',
  trackOrder: 'Track Order',
  gamesCatalog: 'Games Catalog',
  subscriptions: 'Digital Subscriptions',
  searchPlaceholder: 'Search games, diamonds, or passes...',
  allCategories: 'All Games',
  freeFire: 'Free Fire',
  pubgMobile: 'PUBG Mobile',
  efootball: 'eFootball PES',
  eaSportsFc: 'EA SPORTS FC',
  otherSubscriptions: 'Subscriptions & Gift Cards',
  officialNumber: 'Official Payment Number in Mauritania',
  paymentNotice: 'Please send full amount to official number and attach receipt or transaction reference',
  viaPlayerId: 'Via Player ID',
  viaAccount: 'Via Account Login',
  orderReference: 'Order Reference',
  verificationFactor: 'Verification Factor (PIN or Phone)',
  verificationFactorHelp: 'Enter your 4-digit security PIN or phone number used for the order',
  trackButton: 'Track Order Now',
  orderNotFound: 'No matching order found for provided details',
  customerSupport: 'Customer Care & Support',
  businessHours: 'Official Working Hours',
  directWhatsApp: 'Instant WhatsApp Support',
  ticketSubject: 'Inquiry Subject',
  ticketMessage: 'Message Details or Order Note',
  sendTicket: 'Submit Ticket',
  ticketSuccess: 'Your support ticket was submitted successfully',
  login: 'Sign In',
  register: 'Create Account',
  myAccount: 'My Account',
  adminDashboard: 'Admin Console',
  logout: 'Sign Out',
  cart: 'Recharge Bag',
  emptyCart: 'Your cart is currently empty',
  checkout: 'Checkout & Pay',
  total: 'Total',
  mru: 'MRU (Mauritanian Ouguiya)',
  customerDetails: 'Recipient & Player Details',
  fullName: 'Full Name',
  phoneNumber: 'WhatsApp Phone Number',
  playerIdLabel: 'Player ID',
  accountEmailLabel: 'Game Account Email / Phone',
  accountPasswordLabel: 'Account Password (Encrypted)',
  paymentMethodSelect: 'Select Mauritanian Payment Method',
  bankily: 'Bankily',
  masrivi: 'Masrivi',
  sedad: 'Sedad',
  transferProof: 'Transfer Proof',
  uploadProof: 'Upload Payment Screenshot',
  senderPhone: 'Sender Phone Number',
  transactionRef: 'Bank Reference / Transaction #',
  confirmOrder: 'Confirm Order & Submit Payment',
  orderCreatedSuccess: 'Your order was successfully recorded at SHADOW STORE!',
  keepPinSafe: 'Keep your Order Ref & PIN safe to track status anytime:',
  viewOrder: 'View Order Status',
  statusAwaitingPayment: 'Awaiting Payment Verification',
  statusInProgress: 'Fulfillment In Progress',
  statusCompleted: 'Completed Successfully',
  statusRejected: 'Rejected',
  statusCancelled: 'Cancelled',
  statusNeedsReview: 'Needs Review',
  safeRechargeNotice: '100% Official & authorized recharge. ID top-up never asks for your password.',
  adminNotes: 'Admin Notes',
  orderDate: 'Order Date & Time',
  saveId: 'Save Player ID for future orders',
  myOrders: 'My Order History',
  navHome: 'Home',
  navGames: 'Catalog & Prices',
  navTrack: 'Track Order',
  navSupport: 'Support',
  navAccount: 'Account',
  adminOrders: 'Orders Management',
  adminProducts: 'Products & Pricing',
  adminAnnouncements: 'Announcements',
  adminTickets: 'Support Tickets',
  adminLogs: 'Audit & Security Logs',
  adminSettings: 'Store Configuration',
  revenue: 'Total Verified Revenue',
  pendingReviews: 'Pending Payment Reviews',
  changeStatus: 'Update Order Status'
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
  formatCurrency: (amount: number) => string;
  getStatusLabel: (status: OrderStatus) => string;
  getStatusColor: (status: OrderStatus) => { text: string; bg: string; border: string };
  getDeliveryLabel: (method: DeliveryMethod) => string;
  getPaymentMethodLabel: (method: PaymentMethodType) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('shadow_store_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shadow_store_lang', lang);
  };

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = language === 'ar' ? translationsAr : translationsEn;
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${language === 'ar' ? 'أوقية' : 'MRU'}`;
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'awaiting_payment': return t.statusAwaitingPayment;
      case 'in_progress': return t.statusInProgress;
      case 'completed': return t.statusCompleted;
      case 'rejected': return t.statusRejected;
      case 'cancelled': return t.statusCancelled;
      case 'needs_review': return t.statusNeedsReview;
      default: return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/60' };
      case 'in_progress':
        return { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/60' };
      case 'awaiting_payment':
      case 'needs_review':
        return { text: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800/60' };
      case 'rejected':
      case 'cancelled':
        return { text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-800/60' };
      default:
        return { text: 'text-slate-400', bg: 'bg-slate-900', border: 'border-slate-800' };
    }
  };

  const getDeliveryLabel = (method: DeliveryMethod) => {
    return method === 'player_id' ? t.viaPlayerId : t.viaAccount;
  };

  const getPaymentMethodLabel = (method: PaymentMethodType) => {
    switch (method) {
      case 'bankily': return t.bankily;
      case 'masrivi': return t.masrivi;
      case 'sedad': return t.sedad;
      default: return method;
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      dir,
      formatCurrency,
      getStatusLabel,
      getStatusColor,
      getDeliveryLabel,
      getPaymentMethodLabel
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
