export type Language = 'ar' | 'en';

export type DeliveryMethod = 'player_id' | 'account_login';

export type OrderStatus = 
  | 'awaiting_payment' 
  | 'in_progress' 
  | 'completed' 
  | 'rejected' 
  | 'cancelled' 
  | 'needs_review';

export type PaymentMethodType = 'bankily' | 'masrivi' | 'sedad';

export interface GameArtwork {
  gameId: string;
  category: 'free_fire' | 'pubg_mobile' | 'efootball' | 'ea_sports_fc' | 'subscriptions';
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  bannerUrl?: string;
  genre: string;
  accentColor: string;
  descriptionAr: string;
  descriptionEn: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  gameId: string;
  category: 'free_fire' | 'pubg_mobile' | 'efootball' | 'ea_sports_fc' | 'subscriptions';
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: 'diamonds' | 'membership' | 'battle_pass' | 'coins' | 'points' | 'subscription';
  deliveryMethod: DeliveryMethod;
  priceMru: number;
  originalPriceMru?: number;
  amount: number | string;
  unit: string;
  isAvailable: boolean;
  requiredFields: Array<'player_id' | 'account_email' | 'account_password' | 'server_zone' | 'nickname'>;
  badge?: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  amount: number | string;
  unit: string;
  deliveryMethod: DeliveryMethod;
  priceMru: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderRef: string;
  verificationPin: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  playerId?: string;
  serverZone?: string;
  accountEmail?: string;
  deliveryMethod: DeliveryMethod;
  items: OrderItem[];
  totalMru: number;
  paymentMethod: PaymentMethodType;
  paymentPhone?: string;
  paymentTxRef?: string;
  paymentProofUrl?: string;
  status: OrderStatus;
  adminNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  orderRef: string;
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedBy: string;
  reason?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'customer';
  languagePreference: Language;
  savedPlayerIds?: Record<string, string>;
  createdAt: string;
}

export interface Announcement {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  bannerType: 'info' | 'alert' | 'promo';
  active: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketRef: string;
  customerName: string;
  customerPhone: string;
  orderRef?: string;
  subject: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: 'order' | 'product' | 'announcement' | 'ticket' | 'auth' | 'settings';
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface StoreSettings {
  paymentNumber: string;
  whatsappNumber: string;
  businessHoursAr: string;
  businessHoursEn: string;
  bankilyActive: boolean;
  masriviActive: boolean;
  sedadActive: boolean;
  storeOpen: boolean;
  minOrderMru: number;
  autoFulfillmentEnabled: boolean; // currently false as requested
}
