import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, verifyPassword } from './server/db.ts';
import type { OrderStatus, PaymentMethodType, DeliveryMethod } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'shadow_store_jwt_secret_mru_2026';

// Middleware for parsing json and handling file uploads (base64 image proof)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Simple & Secure Token Generator (HMAC-SHA256)
interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'customer';
  exp: number;
}

function createToken(payload: Omit<TokenPayload, 'exp'>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${data}`).digest('base64url');
  return `${header}.${data}.${signature}`;
}

function verifyToken(token: string): TokenPayload | null {
  try {
    const [header, data, signature] = token.split('.');
    if (!header || !data || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${data}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8')) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Auth Request Interface
interface AuthRequest extends Request {
  user?: TokenPayload;
}

// Authentication Middlewares
function authenticateOptional(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'يرجى تسجيل الدخول أولاً' });
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'جلسة الدخول منتهية أو غير صالحة' });
  }
  req.user = user;
  next();
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح - يلزم صلاحيات الإدارة' });
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الوصول محظور - يلزم حساب مدير المتجر' });
  }
  req.user = user;
  next();
}

// Rate Limiter for public endpoints (in-memory sliding window)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({ error: 'عدد الطلبات كبير جداً. يرجى الانتظار قليلاً.' });
    }

    entry.count++;
    next();
  };
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// 1. Store Public Settings
app.get('/api/settings', (_req, res) => {
  const settings = db.getSettings();
  res.json({
    paymentNumber: settings.paymentNumber,
    whatsappNumber: settings.whatsappNumber,
    businessHoursAr: settings.businessHoursAr,
    businessHoursEn: settings.businessHoursEn,
    bankilyActive: settings.bankilyActive,
    masriviActive: settings.masriviActive,
    sedadActive: settings.sedadActive,
    storeOpen: settings.storeOpen,
    minOrderMru: settings.minOrderMru
  });
});

// 2. Announcements
app.get('/api/announcements', (_req, res) => {
  res.json(db.getAnnouncements());
});

// 3. Products Catalog
app.get('/api/products', (_req, res) => {
  res.json(db.getProducts());
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json(product);
});

// Game Artworks Public Catalog
app.get('/api/artworks', (_req, res) => {
  res.json(db.getGameArtworks());
});

app.get('/api/artworks/:gameId', (req, res) => {
  const artwork = db.getGameArtwork(req.params.gameId);
  if (!artwork) {
    return res.status(404).json({ error: 'Game artwork not found' });
  }
  res.json(artwork);
});

// 4. Server-Side Price Calculation (Enforce integrity)
app.post('/api/orders/calculate', (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'قائمة المنتجات فارغة' });
    }
    const calculation = db.calculateServerPrice(items);
    res.json(calculation);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'خطأ في احتساب الأسعار' });
  }
});

// 5. Create Order
app.post('/api/orders', rateLimit(15, 60000), authenticateOptional, (req: AuthRequest, res) => {
  try {
    const {
      customerName,
      customerPhone,
      playerId,
      serverZone,
      accountEmail,
      accountPassword,
      deliveryMethod,
      items,
      paymentMethod,
      paymentPhone,
      paymentTxRef,
      paymentProofUrl,
      customerNotes
    } = req.body;

    // Validation
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'يرجى إدخال اسم العميل ورقم الهاتف' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'يرجى اختيار باقة واحدة على الأقل' });
    }

    if (!paymentMethod || !['bankily', 'masrivi', 'sedad'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'يرجى اختيار طريقة دفع معتمدة (بنكيلي، مصريفي، أو سداد)' });
    }

    // Delivery-specific validation
    if (deliveryMethod === 'player_id' && !playerId) {
      return res.status(400).json({ error: 'يرجى إدخال معرف اللاعب (Player ID) للشحن المباشر' });
    }

    if (deliveryMethod === 'account_login' && (!accountEmail || !accountPassword)) {
      return res.status(400).json({ error: 'يلزم إدخال بيانات الحساب للشحن عبر تسجيل الدخول' });
    }

    const order = db.createOrder({
      userId: req.user?.userId,
      customerName,
      customerPhone,
      playerId,
      serverZone,
      accountEmail,
      accountPassword,
      deliveryMethod: deliveryMethod || 'player_id',
      items,
      paymentMethod: paymentMethod as PaymentMethodType,
      paymentPhone,
      paymentTxRef,
      paymentProofUrl,
      customerNotes
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'تعذر إنشاء الطلب' });
  }
});

// 6. Secure Order Tracking (Lookup with orderRef + PIN or Phone)
app.post('/api/orders/track', rateLimit(20, 60000), (req, res) => {
  const { orderRef, verificationFactor } = req.body;
  if (!orderRef || !verificationFactor) {
    return res.status(400).json({ error: 'يرجى إدخال رقم الطلب وعامل التحقق (رمز PIN أو رقم الهاتف)' });
  }

  const result = db.findOrderByTracking(orderRef, verificationFactor);
  if (!result) {
    return res.status(404).json({ error: 'لم يتم العثور على أي طلب بهذا الرقم' });
  }

  if (result === 'UNAUTHORIZED') {
    return res.status(403).json({ error: 'عامل التحقق غير صحيح لهذا الطلب' });
  }

  const history = db.getOrderHistory(result.id);
  res.json({ order: result, history });
});

// 7. Update Payment Proof After Submission
app.post('/api/orders/:orderRef/proof', rateLimit(10, 60000), (req, res) => {
  const { orderRef } = req.params;
  const { verificationFactor, paymentTxRef, paymentPhone, paymentProofUrl } = req.body;

  const result = db.findOrderByTracking(orderRef, verificationFactor);
  if (!result || result === 'UNAUTHORIZED') {
    return res.status(403).json({ error: 'غير مصرح بتعديل هذا الطلب' });
  }

  if (paymentTxRef) result.paymentTxRef = paymentTxRef.trim();
  if (paymentPhone) result.paymentPhone = paymentPhone.trim();
  if (paymentProofUrl) result.paymentProofUrl = paymentProofUrl;
  result.updatedAt = new Date().toISOString();

  // If status was awaiting_payment, keep it as awaiting_payment with note for manual review
  res.json({ success: true, order: result });
});

// 8. Create Support Ticket
app.post('/api/support', rateLimit(10, 60000), (req, res) => {
  const { customerName, customerPhone, orderRef, subject, message } = req.body;
  if (!customerName || !customerPhone || !subject || !message) {
    return res.status(400).json({ error: 'يرجى ملء جميع الحقول المطلوبة' });
  }
  const ticket = db.createSupportTicket({ customerName, customerPhone, orderRef, subject, message });
  res.status(201).json(ticket);
});

// ==========================================
// AUTHENTICATION & CUSTOMER ROUTES
// ==========================================
app.post('/api/auth/register', rateLimit(10, 60000), (req, res) => {
  try {
    const { email, password, fullName, phone, languagePreference } = req.body;
    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({ error: 'يرجى تقديم جميع البيانات المطلوبة' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن لا تقل عن 6 أحرف' });
    }

    const user = db.createUser({
      email,
      password,
      fullName,
      phone,
      languagePreference: languagePreference || 'ar'
    });

    const token = createToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'فشل التسجيل' });
  }
});

app.post('/api/auth/login', rateLimit(15, 60000), (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
  }

  const userWithSecrets = db.findUserByEmail(email);
  if (!userWithSecrets) {
    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const isValid = verifyPassword(password, userWithSecrets.passwordHash, userWithSecrets.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const { passwordHash: _, salt: __, ...user } = userWithSecrets;
  const token = createToken({ userId: user.id, email: user.email, role: user.role });

  db.logAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: 'USER_LOGIN',
    entityType: 'auth',
    entityId: user.id,
    details: `User ${user.email} logged in (${user.role})`
  });

  res.json({ user, token });
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res) => {
  const user = db.findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }
  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json(safeUser);
});

app.put('/api/auth/profile', requireAuth, (req: AuthRequest, res) => {
  const { fullName, phone, languagePreference, savedPlayerIds } = req.body;
  const updated = db.updateUserProfile(req.user!.userId, {
    fullName,
    phone,
    languagePreference,
    savedPlayerIds
  });
  res.json(updated);
});

app.get('/api/auth/my-orders', requireAuth, (req: AuthRequest, res) => {
  const orders = db.getOrders({ userId: req.user!.userId });
  res.json(orders);
});

// ==========================================
// ADMIN DASHBOARD ROUTES (Role Protected)
// ==========================================
app.get('/api/admin/analytics', requireAdmin, (_req, res) => {
  res.json(db.getAnalytics());
});

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const status = req.query.status as OrderStatus | undefined;
  const orders = db.getOrders({ status });
  res.json(orders);
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, adminNotes, reason } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'حالة الطلب مطلوبة' });
  }

  const updatedOrder = db.updateOrderStatus(id, status, req.user!.email, adminNotes, reason);
  if (!updatedOrder) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }
  res.json(updatedOrder);
});

app.post('/api/admin/products', requireAdmin, (req: AuthRequest, res) => {
  try {
    const product = db.createProduct(req.body, req.user!.email);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'تعذر إضافة المنتج' });
  }
});

app.put('/api/admin/products/:id', requireAdmin, (req: AuthRequest, res) => {
  const updated = db.updateProduct(req.params.id, req.body, req.user!.email);
  if (!updated) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json(updated);
});

// Admin Game Artwork System endpoints
app.get('/api/admin/artworks', requireAdmin, (_req, res) => {
  res.json(db.getGameArtworks());
});

app.put('/api/admin/artworks/:gameId', requireAdmin, (req: AuthRequest, res) => {
  const { gameId } = req.params;
  const { imageUrl, bannerUrl, descriptionAr, descriptionEn, accentColor } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'رابط أو صورة البوستر مطلوبة' });
  }
  const updated = db.updateGameArtwork(gameId, {
    imageUrl,
    bannerUrl,
    descriptionAr,
    descriptionEn,
    accentColor
  }, req.user!.email);
  if (!updated) {
    return res.status(404).json({ error: 'اللعبة غير موجودة' });
  }
  res.json(updated);
});

app.put('/api/admin/products/:id/artwork', requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'صورة المنتج مطلوبة' });
  }
  const updated = db.updateProductArtwork(id, imageUrl, req.user!.email);
  if (!updated) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json(updated);
});

app.get('/api/admin/announcements', requireAdmin, (_req, res) => {
  res.json(db.getAllAnnouncements());
});

app.post('/api/admin/announcements', requireAdmin, (req: AuthRequest, res) => {
  const announcement = db.saveAnnouncement(req.body, req.user!.email);
  res.json(announcement);
});

app.delete('/api/admin/announcements/:id', requireAdmin, (req: AuthRequest, res) => {
  db.deleteAnnouncement(req.params.id, req.user!.email);
  res.json({ success: true });
});

app.get('/api/admin/support', requireAdmin, (_req, res) => {
  res.json(db.getSupportTickets());
});

app.post('/api/admin/support/:id/reply', requireAdmin, (req: AuthRequest, res) => {
  const { response, status } = req.body;
  const ticket = db.replySupportTicket(req.params.id, response, status || 'answered', req.user!.email);
  if (!ticket) {
    return res.status(404).json({ error: 'التذكرة غير موجودة' });
  }
  res.json(ticket);
});

app.get('/api/admin/audit-logs', requireAdmin, (_req, res) => {
  res.json(db.getAuditLogs(150));
});

app.put('/api/admin/settings', requireAdmin, (req: AuthRequest, res) => {
  const updated = db.updateSettings(req.body, req.user!.email);
  res.json(updated);
});

// Setup Vite middlewares in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SHADOW STORE] Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
