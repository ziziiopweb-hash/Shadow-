import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import type { 
  Order, 
  Product, 
  Announcement, 
  SupportTicket, 
  AuditLog, 
  StoreSettings, 
  OrderStatus,
  GameArtwork 
} from '../types/index.ts';
import { 
  TrendingUp, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Eye, 
  Check, 
  X, 
  Edit3, 
  Plus, 
  Bell, 
  MessageSquare, 
  FileText, 
  Settings as SettingsIcon, 
  ExternalLink,
  Search,
  Filter,
  Palette,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export function AdminDashboard() {
  const { t, language, formatCurrency, getStatusLabel, getStatusColor } = useLanguage();
  const { token, user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'artworks' | 'announcements' | 'tickets' | 'audit' | 'settings'>('orders');

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [artworks, setArtworks] = useState<GameArtwork[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected Order for status update modal & proof preview
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('completed');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<boolean>(true);

  // Artwork edit modal state
  const [editingArtwork, setEditingArtwork] = useState<GameArtwork | null>(null);
  const [artworkInputUrl, setArtworkInputUrl] = useState('');
  const [artworkInputMode, setArtworkInputMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [savingArtwork, setSavingArtwork] = useState(false);

  // Ticket reply modal
  const [replyTicket, setReplyTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  // Announcements form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Filter orders
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  const fetchAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resAnal, resOrd, resProd, resArt, resAnn, resTick, resAudit, resSet] = await Promise.all([
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/products'),
        fetch('/api/admin/artworks', { headers }),
        fetch('/api/admin/announcements', { headers }),
        fetch('/api/admin/support', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/settings')
      ]);

      if (resAnal.ok) setAnalytics(await resAnal.json());
      if (resOrd.ok) setOrders(await resOrd.json());
      if (resProd.ok) setProducts(await resProd.json());
      if (resArt.ok) setArtworks(await resArt.json());
      if (resAnn.ok) setAnnouncements(await resAnn.json());
      if (resTick.ok) setTickets(await resTick.json());
      if (resAudit.ok) setAuditLogs(await resAudit.json());
      if (resSet.ok) setSettings(await resSet.json());
    } catch (e: any) {
      console.error('Failed to load admin data:', e);
      setError(e.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Artwork save handler
  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork || !artworkInputUrl.trim()) return;

    setSavingArtwork(true);
    try {
      const res = await fetch(`/api/admin/artworks/${editingArtwork.gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: artworkInputUrl.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to update game artwork');

      setEditingArtwork(null);
      setArtworkInputUrl('');
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error updating artwork');
    } finally {
      setSavingArtwork(false);
    }
  };

  // Order status update action
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes,
          reason: statusReason
        })
      });

      if (!res.ok) throw new Error('Failed to update order');

      setSelectedOrder(null);
      setAdminNotes('');
      setStatusReason('');
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  // Product price update
  const handleSaveProductPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          priceMru: Number(editPrice),
          isAvailable: editAvailable
        })
      });

      if (!res.ok) throw new Error('Failed to update product');

      setEditingProduct(null);
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  // Ticket reply
  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicket) return;

    try {
      const res = await fetch(`/api/admin/support/${replyTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          response: replyText,
          status: 'answered'
        })
      });

      if (!res.ok) throw new Error('Failed to reply to ticket');

      setReplyTicket(null);
      setReplyText('');
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titleAr: newAnnTitle,
          titleEn: newAnnTitle,
          contentAr: newAnnContent,
          contentEn: newAnnContent,
          bannerType: 'info',
          active: true,
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to save announcement');

      setNewAnnTitle('');
      setNewAnnContent('');
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderRef.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.playerId && o.playerId.includes(q)) ||
        o.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (!isAdmin) {
    return (
      <div className="py-24 text-center text-slate-400">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">
          {language === 'ar' ? 'منطقة محظورة — يلزم حساب مدير المتجر' : 'Restricted Area — Admin Account Required'}
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'ar' ? 'سجل دخولك بحساب الإدارة للوصول إلى لوحة التحكم' : 'Please sign in with administrator credentials'}
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#11151f] border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'لوحة تحكم المشرف والمدير' : 'Admin Operations Center'}</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            SHADOW STORE CONSOLE
          </h2>
        </div>

        {/* Integration Credentials Transparency Notice */}
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 max-w-md">
          <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{language === 'ar' ? 'وضع التنفيذ والتحقق اليدوي نشط' : 'Manual Verification Mode Active'}</span>
          </p>
          <p className="text-[11px] text-slate-400 leading-tight">
            {language === 'ar'
              ? 'التحقق من الدفع يتم يدوياً عبر بنكيلي ومصريفي وسداد (31520844) وتأكيد الشحن بالمعرف ID من قبل المشرفين.'
              : 'Payments are manually confirmed in bank statements (31520844) and fulfilled via official ID top-up.'}
          </p>
        </div>
      </div>

      {/* Real-time Analytics Cards (Calculated directly from Database) */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-[#11151f] border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{t.revenue}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {analytics.totalRevenueMru.toLocaleString()} MRU
            </div>
            <span className="text-[10px] text-slate-500">
              {analytics.completedOrdersCount} {language === 'ar' ? 'طلبات مكتملة ومؤكدة' : 'completed orders'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#11151f] border border-amber-500/30">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{t.pendingReviews}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              {analytics.awaitingPaymentCount}
            </div>
            <span className="text-[10px] text-slate-500">
              {analytics.pendingReviewVolumeMru.toLocaleString()} MRU {language === 'ar' ? 'قيد التدقيق' : 'pending volume'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#11151f] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</span>
              <ShoppingBag className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono tabular-nums">
              {analytics.totalOrders}
            </div>
            <span className="text-[10px] text-slate-500">
              {analytics.totalCustomers} {language === 'ar' ? 'عميل مسجل' : 'customers'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#11151f] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{language === 'ar' ? 'تذاكر الدعم المفتوحة' : 'Open Tickets'}</span>
              <MessageSquare className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-orange-400 font-mono tabular-nums">
              {analytics.openTicketsCount}
            </div>
            <span className="text-[10px] text-slate-500">
              {language === 'ar' ? 'تتطلب رد المشرف' : 'awaiting reply'}
            </span>
          </div>

        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
        {[
          { id: 'orders', label: t.adminOrders, icon: ShoppingBag, count: orders.length },
          { id: 'products', label: t.adminProducts, icon: Edit3, count: products.length },
          { id: 'artworks', label: language === 'ar' ? 'بوسترات وصور الألعاب' : 'Game Artworks', icon: Palette, count: artworks.length },
          { id: 'announcements', label: t.adminAnnouncements, icon: Bell, count: announcements.length },
          { id: 'tickets', label: t.adminTickets, icon: MessageSquare, count: tickets.length },
          { id: 'audit', label: t.adminLogs, icon: FileText, count: auditLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#141824] text-slate-400 hover:text-white hover:bg-[#1a2030]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-black text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#11151f] border border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تصفية الحالة:' : 'Filter:'}</span>
              </span>
              {[
                { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
                { id: 'awaiting_payment', label: language === 'ar' ? 'في انتظار الدفع' : 'Awaiting' },
                { id: 'in_progress', label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress' },
                { id: 'completed', label: language === 'ar' ? 'مكتمل' : 'Completed' },
                { id: 'needs_review', label: language === 'ar' ? 'يحتاج مراجعة' : 'Needs Review' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === f.id
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-[#161a26] text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Order Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder={language === 'ar' ? 'بحث برقم الطلب، الهاتف، أو ID...' : 'Search by Ref, Phone, ID...'}
                className="w-full bg-[#161a26] border border-slate-700 rounded-xl ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl bg-[#11151f] border border-white/5 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-[#141826] text-slate-400 border-b border-white/5 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-3.5 text-start">{t.orderReference}</th>
                    <th className="p-3.5 text-start">{t.fullName} / الهاتف</th>
                    <th className="p-3.5 text-start">{language === 'ar' ? 'الباقة واللاعب' : 'Item & Player'}</th>
                    <th className="p-3.5 text-start">{t.total}</th>
                    <th className="p-3.5 text-start">{language === 'ar' ? 'طريقة الدفع' : 'Payment'}</th>
                    <th className="p-3.5 text-start">{language === 'ar' ? 'إثبات الدفع' : 'Proof'}</th>
                    <th className="p-3.5 text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="p-3.5 text-end">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        {language === 'ar' ? 'لا توجد طلبات مطابقة للفلتر المحدد' : 'No orders found matching filter'}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const statusColor = getStatusColor(ord.status);
                      return (
                        <tr key={ord.id} className="hover:bg-[#151926] transition-colors">
                          <td className="p-3.5 font-mono font-bold text-amber-400">
                            {ord.orderRef}
                            <span className="block text-[10px] text-slate-500 font-sans">
                              PIN: {ord.verificationPin}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{ord.customerName}</div>
                            <span className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-200">
                              {ord.items.map(i => language === 'ar' ? i.productNameAr : i.productNameEn).join(', ')}
                            </div>
                            {ord.playerId && (
                              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                                ID: {ord.playerId}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono font-black text-amber-400 tabular-nums">
                            {ord.totalMru} MRU
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold uppercase text-slate-300">{ord.paymentMethod}</span>
                            {ord.paymentTxRef && (
                              <span className="block text-[10px] text-slate-400 font-mono">
                                Ref: {ord.paymentTxRef}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {ord.paymentProofUrl ? (
                              <button
                                onClick={() => setPreviewProofUrl(ord.paymentProofUrl!)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] font-bold cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{language === 'ar' ? 'عرض الوصل' : 'View'}</span>
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[11px]">
                                {language === 'ar' ? 'بدون وصل' : 'No receipt'}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                              {getStatusLabel(ord.status)}
                            </span>
                          </td>
                          <td className="p-3.5 text-end">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setNewStatus(ord.status);
                                setAdminNotes(ord.adminNotes || '');
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-[#1d2332] text-amber-400 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                            >
                              {t.changeStatus}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRODUCTS & PRICING MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#11151f] border border-white/5 flex items-center justify-between">
            <h3 className="font-extrabold text-white text-sm">
              {language === 'ar' ? 'تعديل أسعار المنتجات وحالة التوفر' : 'Product Pricing & Availability'}
            </h3>
            <span className="text-xs text-slate-400">
              {products.length} {language === 'ar' ? 'منتج معتمد' : 'products'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-xl bg-[#11151f] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">{prod.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prod.isAvailable ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                      {prod.isAvailable ? (language === 'ar' ? 'متاح للطلب' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Disabled')}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{language === 'ar' ? prod.nameAr : prod.nameEn}</h4>
                  <p className="text-xs text-slate-400 mb-3">{prod.deliveryMethod === 'player_id' ? t.viaPlayerId : t.viaAccount}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-base font-black text-amber-400 font-mono tabular-nums">
                    {prod.priceMru} MRU
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setEditPrice(prod.priceMru);
                      setEditAvailable(prod.isAvailable);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-[#1a2130] text-amber-300 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{language === 'ar' ? 'تعديل السعر' : 'Edit'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: GAME ARTWORK MANAGEMENT */}
      {activeTab === 'artworks' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#11151f] border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <Palette className="w-4 h-4" />
                <span>{language === 'ar' ? 'نظام البوسترات والهوية البصرية للألعاب' : 'Dynamic Game Artwork System'}</span>
              </div>
              <h3 className="text-lg font-black text-white">
                {language === 'ar' ? 'تخصيص واستبدال صور الألعاب والبطاقات' : 'Manage & Replace Game Artworks'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {language === 'ar' 
                  ? 'كل لعبة تمتلك صورة وبوستر فريد يعكس هويتها ونوعها. تغيير البوستر يحدّث تلقائياً بطاقات الشحن والصفحات المرتبطة بها مع الحفاظ التام على الأسعار.'
                  : 'Every game features its own genre-authentic artwork. Updating an artwork synchronizes game cards while keeping pricing separate.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#151926] border border-white/5 text-xs text-slate-300">
              <span className="font-bold text-amber-400 block mb-0.5 font-mono">{artworks.length} Games Active</span>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? 'بدون صور مكررة أو عامة' : 'Zero generic images'}
              </span>
            </div>
          </div>

          {/* Artworks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => {
              const linkedProducts = products.filter(p => p.gameId === art.gameId);
              return (
                <div
                  key={art.gameId}
                  className="rounded-2xl bg-[#11151f] border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all"
                >
                  <div>
                    {/* Artwork Preview Box */}
                    <div className="relative h-48 w-full bg-[#161a26] overflow-hidden group">
                      <img
                        src={art.imageUrl}
                        alt={art.nameEn}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#11151f] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 start-3">
                        <span 
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase backdrop-blur-md border border-white/10"
                          style={{ backgroundColor: `${art.accentColor}30`, color: art.accentColor }}
                        >
                          {art.genre}
                        </span>
                      </div>

                      <div className="absolute bottom-3 start-3 end-3 flex justify-between items-center text-xs">
                        <span className="text-[11px] font-bold text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          {linkedProducts.length} {language === 'ar' ? 'باقات مرتبطة' : 'linked packages'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-white text-base">
                        {language === 'ar' ? art.nameAr : art.nameEn}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {language === 'ar' ? art.descriptionAr : art.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setEditingArtwork(art);
                        setArtworkInputUrl(art.imageUrl);
                        setArtworkInputMode('upload');
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#191f2c] text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تعديل واستبدال البوستر' : 'Replace Game Artwork'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Create Announcement Form */}
          <div className="p-5 rounded-2xl bg-[#11151f] border border-white/5">
            <h3 className="font-extrabold text-white text-sm mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'إضافة إشعار أو تنبيه جديد لشريط المتجر' : 'Post New Store Announcement'}</span>
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder={language === 'ar' ? 'عنوان التنبيه (مثال: خصم خاص على فري فاير)' : 'Announcement title...'}
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200"
                />
              </div>
              <div>
                <textarea
                  required
                  rows={2}
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  placeholder={language === 'ar' ? 'تفاصيل التنبيه الموجه للعملاء...' : 'Announcement content...'}
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
              >
                {language === 'ar' ? 'نشر الإعلان' : 'Publish Announcement'}
              </button>
            </form>
          </div>

          {/* List of active announcements */}
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl bg-[#11151f] border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-amber-400 text-sm mb-1">{ann.titleAr}</h4>
                  <p className="text-xs text-slate-300">{ann.contentAr}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(ann.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await fetch(`/api/admin/announcements/${ann.id}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchAllData();
                  }}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#11151f] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-[#141826] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3.5 text-start">رقم التذكرة</th>
                    <th className="p-3.5 text-start">العميل</th>
                    <th className="p-3.5 text-start">الموضوع</th>
                    <th className="p-3.5 text-start">الرسالة</th>
                    <th className="p-3.5 text-start">الحالة</th>
                    <th className="p-3.5 text-end">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        لا توجد تذاكر دعم حالياً
                      </td>
                    </tr>
                  ) : (
                    tickets.map((tck) => (
                      <tr key={tck.id} className="hover:bg-[#141826]">
                        <td className="p-3.5 font-mono font-bold text-amber-400">{tck.ticketRef}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{tck.customerName}</div>
                          <span className="text-[11px] font-mono text-slate-400">{tck.customerPhone}</span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-200">{tck.subject}</td>
                        <td className="p-3.5 max-w-xs truncate text-slate-400">{tck.message}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tck.status === 'open' ? 'bg-orange-950/60 text-orange-400 border border-orange-800' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'}`}>
                            {tck.status === 'open' ? 'جديدة' : 'تم الرد'}
                          </span>
                        </td>
                        <td className="p-3.5 text-end">
                          <button
                            onClick={() => {
                              setReplyTicket(tck);
                              setReplyText(tck.adminResponse || '');
                            }}
                            className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black font-bold cursor-pointer"
                          >
                            الرد على التذكرة
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#11151f] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs font-mono">
                <thead className="bg-[#141826] text-slate-400 uppercase">
                  <tr>
                    <th className="p-3 text-start">الوقت</th>
                    <th className="p-3 text-start">المستخدم</th>
                    <th className="p-3 text-start">الإجراء</th>
                    <th className="p-3 text-start">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#151926]">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3 text-amber-400 font-bold whitespace-nowrap">
                        {log.actorEmail}
                      </td>
                      <td className="p-3 text-emerald-400 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="p-3 text-slate-300">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ORDER STATUS UPDATE */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#11151f] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-white text-base">
                تحديث حالة الطلب: <span className="text-amber-400 font-mono">{selectedOrder.orderRef}</span>
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اختر الحالة الجديدة
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="awaiting_payment">في انتظار الدفع / المراجعة</option>
                  <option value="in_progress">قيد الشحن والتنفيذ</option>
                  <option value="completed">مكتمل (تم الشحن بنجاح)</option>
                  <option value="needs_review">يحتاج مراجعة مع العميل</option>
                  <option value="rejected">مرفوض</option>
                  <option value="cancelled">ملغى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ملاحظات تظهر للعميل في صفحة التتبع
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="مثال: تم شحن 110 جوهرة لحسابك بنجاح عبر الآيدي"
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  سبب التغيير (للتوثيق الداخلي)
                </label>
                <input
                  type="text"
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="مثال: تم التأكد من وصول 50 أوقية على بنكيلي"
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#171b26] text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
                >
                  حفظ الحالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PAYMENT PROOF IMAGE PREVIEW */}
      {previewProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-[#11151f] rounded-2xl border border-amber-500/30 p-4 shadow-2xl">
            <button
              onClick={() => setPreviewProofUrl(null)}
              className="absolute top-4 end-4 p-1.5 rounded-lg bg-black/70 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-white text-sm mb-3">وصل التحويل البنكي المرفوع</h4>
            <div className="max-h-[75vh] overflow-auto rounded-xl border border-white/10">
              <img src={previewProofUrl} alt="Receipt Proof" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRODUCT PRICE EDIT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#11151f] rounded-2xl border border-amber-500/30 p-5 shadow-2xl">
            <h4 className="font-bold text-white text-sm mb-3">
              تعديل: {editingProduct.nameAr}
            </h4>
            <form onSubmit={handleSaveProductPrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  السعر بالأوقية الجديدة (MRU)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prodAvail"
                  checked={editAvailable}
                  onChange={(e) => setEditAvailable(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 cursor-pointer"
                />
                <label htmlFor="prodAvail" className="text-xs text-slate-300 cursor-pointer">
                  متاح للطلب في المتجر
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#171b26] text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400"
                >
                  حفظ التعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: TICKET REPLY */}
      {replyTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#11151f] rounded-2xl border border-amber-500/30 p-5 shadow-2xl">
            <h4 className="font-bold text-white text-sm mb-1">
              الرد على تذكرة: {replyTicket.ticketRef}
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              العميل: {replyTicket.customerName} ({replyTicket.customerPhone})
            </p>

            <form onSubmit={handleSendTicketReply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نص الرد الرسمي
                </label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك للعميل هنا..."
                  className="w-full bg-[#161a26] border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyTicket(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#171b26] text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400"
                >
                  إرسال الرد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: GAME ARTWORK REPLACEMENT & PREVIEW */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#11151f] rounded-2xl border border-amber-500/40 p-6 shadow-2xl my-8">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">
                  {language === 'ar' ? 'تخصيص بوستر اللعبة:' : 'Customize Game Artwork:'} <span className="text-amber-400">{editingArtwork.nameAr}</span>
                </h3>
              </div>
              <button 
                onClick={() => setEditingArtwork(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {language === 'ar'
                ? 'استبدل البوستر الحالي بصورة فريدة خاصة باللعبة. يتم حفظ البوستر في قاعدة البيانات وربطه تلقائياً مع جميع باقات الشحن.'
                : 'Replace current artwork with a unique genre-authentic image. Saved persistently in database.'}
            </p>

            {/* Input Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-[#161a26] rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setArtworkInputMode('upload')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  artworkInputMode === 'upload' ? 'bg-amber-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'رفع ملف صورة' : 'Upload File'}</span>
              </button>
              <button
                type="button"
                onClick={() => setArtworkInputMode('url')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  artworkInputMode === 'url' ? 'bg-amber-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'رابط خارجي' : 'Image URL'}</span>
              </button>
              <button
                type="button"
                onClick={() => setArtworkInputMode('presets')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  artworkInputMode === 'presets' ? 'bg-amber-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'معرض البوسترات' : 'Presets'}</span>
              </button>
            </div>

            {/* Form Fields according to selected mode */}
            <form onSubmit={handleSaveArtwork} className="space-y-4">
              
              {/* Mode 1: File Upload */}
              {artworkInputMode === 'upload' && (
                <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setArtworkInputUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">
                      {language === 'ar' ? 'انقر أو اسحب لاختيار صورة البوستر' : 'Click to select artwork image'}
                    </span>
                    <span className="text-[10px] text-slate-500">PNG, JPG, WebP (Max 8MB)</span>
                  </div>
                </div>
              )}

              {/* Mode 2: Direct URL */}
              {artworkInputMode === 'url' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {language === 'ar' ? 'رابط الصورة المباشر' : 'Direct Image URL'}
                  </label>
                  <input
                    type="text"
                    value={artworkInputUrl}
                    onChange={(e) => setArtworkInputUrl(e.target.value)}
                    placeholder="https://... or /src/assets/images/..."
                    className="w-full bg-[#161a26] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              )}

              {/* Mode 3: Curated Genre Presets */}
              {artworkInputMode === 'presets' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    {language === 'ar' ? 'اختر من المعرض المعتمد عالي الدقة:' : 'Select from verified high-definition presets:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                    {[
                      { name: 'Free Fire Tactical Squad', url: '/src/assets/images/free_fire_squad_official_1792944383102.jpg', tag: 'Free Fire' },
                      { name: 'Free Fire Classic Battle', url: '/src/assets/images/free_fire_showcase_1792943357625.jpg', tag: 'Free Fire' },
                      { name: 'eFootball Pink Kit Star', url: '/src/assets/images/efootball_yamal_pink_promo_1792944382821.jpg', tag: 'eFootball' },
                      { name: 'eFootball Stadium Lights', url: '/src/assets/images/efootball_promo_card_1792943824413.jpg', tag: 'eFootball' },
                      { name: 'PUBG Tactical Island', url: '/src/assets/images/pubg_tactical_landscape_1792944226624.jpg', tag: 'PUBG' },
                      { name: 'PUBG Level 3 Golden Helmet', url: '/src/assets/images/pubg_mobile_showcase_1792943358747.jpg', tag: 'PUBG' },
                      { name: 'EA SPORTS FC Stadium Pitch', url: '/src/assets/images/ea_sports_fc_showcase_1792944226485.jpg', tag: 'EA FC' },
                      { name: 'Digital Holographic Cards', url: '/src/assets/images/digital_cards_showcase_1792944226065.jpg', tag: 'Cards' },
                    ].map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setArtworkInputUrl(preset.url)}
                        className={`p-2 rounded-xl border text-start flex items-center gap-2 transition-all cursor-pointer ${
                          artworkInputUrl === preset.url
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-[#151926] border-white/5 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-9 h-9 object-cover rounded-lg shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate">{preset.name}</p>
                          <span className="text-[9px] text-slate-500 uppercase">{preset.tag}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-Time Live Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {language === 'ar' ? 'معاينة البوستر الجديد:' : 'Live Artwork Preview:'}
                </label>
                <div className="relative h-44 rounded-xl overflow-hidden border border-amber-500/30 bg-[#0d1017]">
                  {artworkInputUrl ? (
                    <>
                      <img
                        src={artworkInputUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 start-3 end-3 flex justify-between items-center text-xs">
                        <span className="font-bold text-white text-xs">{editingArtwork.nameAr}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">READY TO SAVE</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      {language === 'ar' ? 'اختر أو ارفع صورة لعرض المعاينة' : 'Select an image to preview'}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#171b26] text-slate-300 hover:text-white cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={savingArtwork || !artworkInputUrl.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingArtwork ? '...' : (language === 'ar' ? 'حفظ وتطبيق البوستر' : 'Save & Apply Artwork')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
