import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { 
  Product, 
  Order, 
  OrderStatusHistoryItem, 
  User, 
  Announcement, 
  SupportTicket, 
  AuditLog, 
  StoreSettings, 
  OrderStatus,
  GameArtwork 
} from '../src/types/index.ts';

interface DbSchema {
  users: Array<User & { passwordHash: string; salt: string }>;
  products: Product[];
  gameArtworks: GameArtwork[];
  orders: Order[];
  orderHistory: OrderStatusHistoryItem[];
  announcements: Announcement[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  settings: StoreSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'shadow_store.json');

// Password security functions using crypto
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch {
    return false;
  }
}

// Initial Free Fire Exact Pricing per prompt
const DEFAULT_PRODUCTS: Product[] = [
  // --- FREE FIRE DIAMONDS (VIA PLAYER ID) ---
  {
    id: 'ff-dia-110',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '110 جوهرة فري فاير',
    nameEn: '110 Free Fire Diamonds',
    descriptionAr: 'شحن فوري ومباشر عن طريق معرف اللاعب (Player ID) فقط بدون كلمة سر.',
    descriptionEn: 'Instant top-up via Player ID only. Safe and password-free.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 50,
    originalPriceMru: 60,
    amount: 110,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'الأكثر طلباً',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-220',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '220 جوهرة فري فاير',
    nameEn: '220 Free Fire Diamonds',
    descriptionAr: 'شحن رسمي سريع عبر المعرف ID.',
    descriptionEn: 'Official fast top-up via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 100,
    originalPriceMru: 120,
    amount: 220,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-330',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '330 جوهرة فري فاير',
    nameEn: '330 Free Fire Diamonds',
    descriptionAr: 'شحن رسمي سريع عبر المعرف ID.',
    descriptionEn: 'Official fast top-up via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 150,
    originalPriceMru: 180,
    amount: 330,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-440',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '440 جوهرة فري فاير',
    nameEn: '440 Free Fire Diamonds',
    descriptionAr: 'شحن رسمي سريع عبر المعرف ID.',
    descriptionEn: 'Official fast top-up via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 200,
    originalPriceMru: 240,
    amount: 440,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-1166',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '1166 جوهرة فري فاير',
    nameEn: '1166 Free Fire Diamonds',
    descriptionAr: 'باقة مميزة مع بونص إضافي رسمي عبر المعرف ID.',
    descriptionEn: 'Official large diamond pack via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 500,
    originalPriceMru: 580,
    amount: 1166,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'عرض توفيري',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-1386',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '1386 جوهرة فري فاير',
    nameEn: '1386 Free Fire Diamonds',
    descriptionAr: 'شحن فوري عبر المعرف ID.',
    descriptionEn: 'Instant recharge via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 600,
    originalPriceMru: 690,
    amount: 1386,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-1606',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '1606 جوهرة فري فاير',
    nameEn: '1606 Free Fire Diamonds',
    descriptionAr: 'شحن رسمي عبر المعرف ID.',
    descriptionEn: 'Official recharge via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 700,
    originalPriceMru: 800,
    amount: 1606,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-dia-2368',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: '2368 جوهرة فري فاير',
    nameEn: '2368 Free Fire Diamonds',
    descriptionAr: 'الباقة الكبرى للأساطير عبر المعرف ID.',
    descriptionEn: 'Mega pack for esports players via Player ID.',
    type: 'diamonds',
    deliveryMethod: 'player_id',
    priceMru: 1000,
    originalPriceMru: 1180,
    amount: 2368,
    unit: 'جوهرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'باقة المحترفين',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },

  // --- FREE FIRE MEMBERSHIPS VIA PLAYER ID ---
  {
    id: 'ff-mem-week-id',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: 'عضوية فري فاير أسبوعية (عبر الـ ID)',
    nameEn: 'Free Fire Weekly Membership (via ID)',
    descriptionAr: 'تفعيل العضوية الأسبوعية الرسمية مباشرة عن طريق الآيدي فقط.',
    descriptionEn: 'Official weekly membership activated via Player ID only.',
    type: 'membership',
    deliveryMethod: 'player_id',
    priceMru: 120,
    originalPriceMru: 140,
    amount: 'أسبوعية ID',
    unit: 'عضوية',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'عبر المعرف',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-mem-month-id',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: 'عضوية فري فاير شهرية (عبر الـ ID)',
    nameEn: 'Free Fire Monthly Membership (via ID)',
    descriptionAr: 'تفعيل العضوية الشهرية الرسمية المميزة عن طريق الآيدي ID فقط.',
    descriptionEn: 'Official monthly membership activated via Player ID only.',
    type: 'membership',
    deliveryMethod: 'player_id',
    priceMru: 450,
    originalPriceMru: 500,
    amount: 'شهرية ID',
    unit: 'عضوية',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'عبر المعرف',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },

  // --- FREE FIRE MEMBERSHIPS VIA ACCOUNT-BASED DELIVERY ---
  {
    id: 'ff-mem-week-acc',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: 'عضوية فري فاير أسبوعية (عبر الحساب)',
    nameEn: 'Free Fire Weekly Membership (via Account)',
    descriptionAr: 'تفعيل اقتصادي عبر تسجيل الدخول الرسمي المشفر. يلزم إدخال بيانات الدخول مع رموز النسخ الاحتياطي.',
    descriptionEn: 'Economical activation via secure account login. Requires login info and 2FA backup codes.',
    type: 'membership',
    deliveryMethod: 'account_login',
    priceMru: 100,
    originalPriceMru: 120,
    amount: 'أسبوعية حساب',
    unit: 'عضوية',
    isAvailable: true,
    requiredFields: ['account_email', 'account_password'],
    badge: 'توفير أكبر',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },
  {
    id: 'ff-mem-month-acc',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: 'عضوية فري فاير شهرية (عبر الحساب)',
    nameEn: 'Free Fire Monthly Membership (via Account)',
    descriptionAr: 'تفعيل اقتصادي عبر تسجيل الدخول الرسمي المشفر للحساب.',
    descriptionEn: 'Economical activation via secure account login for 30 days.',
    type: 'membership',
    deliveryMethod: 'account_login',
    priceMru: 400,
    originalPriceMru: 450,
    amount: 'شهرية حساب',
    unit: 'عضوية',
    isAvailable: true,
    requiredFields: ['account_email', 'account_password'],
    badge: 'توفير أكبر',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },

  // --- BOOYAH PASS ---
  {
    id: 'ff-booyah-pass',
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: 'بطاقة بويا باس (Booyah Pass)',
    nameEn: 'Free Fire Booyah Pass',
    descriptionAr: 'فتح تذكرة بويا باس للموسم الحالي لفتح جميع الجوائز والسكينات الحصرية.',
    descriptionEn: 'Unlock current season Booyah Pass for exclusive skins and rewards.',
    type: 'battle_pass',
    deliveryMethod: 'player_id',
    priceMru: 150,
    originalPriceMru: 180,
    amount: 'الموسم الحالي',
    unit: 'تذكرة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'موسمي',
    image: '/src/assets/images/free_fire_showcase_1792943357625.jpg'
  },

  // --- PUBG MOBILE UC ---
  {
    id: 'pubg-uc-60',
    gameId: 'pubg_mobile',
    category: 'pubg_mobile',
    nameAr: '60 شدة ببجي موبايل (UC)',
    nameEn: '60 PUBG Mobile UC',
    descriptionAr: 'شحن رسمي مباشر عن طريق الآيدي ID.',
    descriptionEn: 'Direct official UC recharge via Player ID.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 45,
    originalPriceMru: 55,
    amount: 60,
    unit: 'شدة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/pubg_tactical_landscape_1792944226624.jpg'
  },
  {
    id: 'pubg-uc-325',
    gameId: 'pubg_mobile',
    category: 'pubg_mobile',
    nameAr: '325 شدة ببجي موبايل (UC)',
    nameEn: '325 PUBG Mobile UC',
    descriptionAr: 'شحن رسمي مباشر عبر المعرف ID.',
    descriptionEn: 'Direct official UC recharge via Player ID.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 220,
    originalPriceMru: 250,
    amount: 325,
    unit: 'شدة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'شائع',
    image: '/src/assets/images/pubg_tactical_landscape_1792944226624.jpg'
  },
  {
    id: 'pubg-uc-660',
    gameId: 'pubg_mobile',
    category: 'pubg_mobile',
    nameAr: '660 شدة ببجي موبايل (UC)',
    nameEn: '660 PUBG Mobile UC',
    descriptionAr: 'شحن الرويال باس وتفعيل التذكرة الموسمية.',
    descriptionEn: 'Royale Pass package via Player ID.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 430,
    originalPriceMru: 480,
    amount: 660,
    unit: 'شدة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'رويال باس',
    image: '/src/assets/images/pubg_tactical_landscape_1792944226624.jpg'
  },
  {
    id: 'pubg-uc-1800',
    gameId: 'pubg_mobile',
    category: 'pubg_mobile',
    nameAr: '1800 شدة ببجي موبايل (UC)',
    nameEn: '1800 PUBG Mobile UC',
    descriptionAr: 'باقة الشدات الكبيرة للمتفرغين والحسابات المطورة.',
    descriptionEn: 'Large tactical UC pack via Player ID.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 1150,
    originalPriceMru: 1300,
    amount: 1800,
    unit: 'شدة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/pubg_tactical_landscape_1792944226624.jpg'
  },

  // --- eFootball PES COINS ---
  {
    id: 'efb-coins-130',
    gameId: 'efootball',
    category: 'efootball',
    nameAr: '130 كوينز إي فوتبول (eFootball)',
    nameEn: '130 eFootball Coins',
    descriptionAr: 'شحن مباشر عبر Konami ID أو المعرف.',
    descriptionEn: 'Direct coins top-up for eFootball via ID.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 55,
    originalPriceMru: 65,
    amount: 130,
    unit: 'كوينز',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/efootball_promo_card_1792943824413.jpg'
  },
  {
    id: 'efb-coins-550',
    gameId: 'efootball',
    category: 'efootball',
    nameAr: '550 كوينز إي فوتبول (eFootball)',
    nameEn: '550 eFootball Coins',
    descriptionAr: 'شحن حزم الباكات واللاعبين الإبيك المميزين.',
    descriptionEn: 'Epic packs coins top-up via ID.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 230,
    originalPriceMru: 260,
    amount: 550,
    unit: 'كوينز',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'باك إبيك',
    image: '/src/assets/images/efootball_promo_card_1792943824413.jpg'
  },
  {
    id: 'efb-coins-1050',
    gameId: 'efootball',
    category: 'efootball',
    nameAr: '1050 كوينز إي فوتبول (eFootball)',
    nameEn: '1050 eFootball Coins',
    descriptionAr: 'باقة كبرى لتطوير تشكيلة الفريق الأسطورية.',
    descriptionEn: 'Mega coin pack for ultimate dream team squad.',
    type: 'coins',
    deliveryMethod: 'player_id',
    priceMru: 440,
    originalPriceMru: 500,
    amount: 1050,
    unit: 'كوينز',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/efootball_promo_card_1792943824413.jpg'
  },

  // --- EA SPORTS FC MOBILE POINTS ---
  {
    id: 'eafc-points-500',
    gameId: 'ea_sports_fc',
    category: 'ea_sports_fc',
    nameAr: '500 نقطة FC Mobile Points',
    nameEn: '500 FC Mobile Points',
    descriptionAr: 'نقاط EA SPORTS FC لشراء التذاكر والباكات.',
    descriptionEn: 'Points for FC packs and seasonal events.',
    type: 'points',
    deliveryMethod: 'player_id',
    priceMru: 75,
    originalPriceMru: 90,
    amount: 500,
    unit: 'نقطة',
    isAvailable: true,
    requiredFields: ['player_id'],
    image: '/src/assets/images/ea_sports_fc_showcase_1792944226485.jpg'
  },
  {
    id: 'eafc-points-1050',
    gameId: 'ea_sports_fc',
    category: 'ea_sports_fc',
    nameAr: '1050 نقطة FC Mobile Points',
    nameEn: '1050 FC Mobile Points',
    descriptionAr: 'شحن رسمي سريع لحسابك في EA FC Mobile.',
    descriptionEn: 'Official FC Points package via UID.',
    type: 'points',
    deliveryMethod: 'player_id',
    priceMru: 150,
    originalPriceMru: 175,
    amount: 1050,
    unit: 'نقطة',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'الأكثر طلباً',
    image: '/src/assets/images/ea_sports_fc_showcase_1792944226485.jpg'
  },

  // --- DIGITAL SUBSCRIPTIONS ---
  {
    id: 'sub-discord-nitro',
    gameId: 'subscriptions',
    category: 'subscriptions',
    nameAr: 'اشتراك ديسكورد نيترو قياسي (1 شهر)',
    nameEn: 'Discord Nitro Standard (1 Month)',
    descriptionAr: 'كود تفعيل اشتراك ديسكورد نيترو مع البوستات والمميزات الخاصة.',
    descriptionEn: 'Discord Nitro 1 month digital gift code with 2 server boosts.',
    type: 'subscription',
    deliveryMethod: 'player_id',
    priceMru: 380,
    originalPriceMru: 420,
    amount: '1 شهر',
    unit: 'اشتراك',
    isAvailable: true,
    requiredFields: ['player_id'],
    badge: 'كود رقمي',
    image: '/src/assets/images/digital_cards_showcase_1792944226065.jpg'
  }
];

// Default Game Artworks Catalogue
export const DEFAULT_GAME_ARTWORKS: GameArtwork[] = [
  {
    gameId: 'free_fire',
    category: 'free_fire',
    nameAr: 'فري فاير (Free Fire)',
    nameEn: 'Free Fire',
    imageUrl: '/assets/images/free_fire_official_user.jpg',
    bannerUrl: '/assets/images/free_fire_official_user.jpg',
    genre: 'Battle Royale / Action',
    accentColor: '#f97316',
    descriptionAr: 'أبطال باتل رويال، أزياء تكتيكية، مشاهد حماسية مع الفريق الكامل والعتاد العسكري.',
    descriptionEn: 'Battle royale heroes, tactical outfits, and dramatic action squad.',
    updatedAt: new Date().toISOString()
  },
  {
    gameId: 'pubg_mobile',
    category: 'pubg_mobile',
    nameAr: 'ببجي موبايل (PUBG Mobile)',
    nameEn: 'PUBG Mobile',
    imageUrl: '/src/assets/images/pubg_tactical_landscape_1792944226624.jpg',
    bannerUrl: '/src/assets/images/pubg_mobile_showcase_1792943358747.jpg',
    genre: 'Tactical Battle Royale',
    accentColor: '#eab308',
    descriptionAr: 'بيئات قتالية تكتيكية واقعية، عتاد عسكري محترف، إنزال جوي بدخان أحمر ومشاهد بانورامية للجزيرة.',
    descriptionEn: 'Realistic tactical battle royale environments, professional military gear, and cinematic island landscapes.',
    updatedAt: new Date().toISOString()
  },
  {
    gameId: 'efootball',
    category: 'efootball',
    nameAr: 'إي فوتبول بيس (eFootball PES)',
    nameEn: 'eFootball PES',
    imageUrl: '/assets/images/efootball_official_user.jpg',
    bannerUrl: '/assets/images/efootball_official_user.jpg',
    genre: 'Football / Sports Simulation',
    accentColor: '#06b6d4',
    descriptionAr: 'إصدار لامين يامال ديلوكس 2027، رسومات رياضية باللون السماوي والماجنتا والأزرق.',
    descriptionEn: 'Lamine Yamal Deluxe Edition 2027, vibrant cyan, magenta, and deep blue sports graphics.',
    updatedAt: new Date().toISOString()
  },
  {
    gameId: 'ea_sports_fc',
    category: 'ea_sports_fc',
    nameAr: 'إي إيه سبورتس إف سي (EA SPORTS FC)',
    nameEn: 'EA SPORTS FC Mobile',
    imageUrl: '/src/assets/images/ea_sports_fc_showcase_1792944226485.jpg',
    genre: 'Football / Sports Simulation',
    accentColor: '#10b981',
    descriptionAr: 'ملاعب كرة قدم فخمة ممتلئة بالجماهير، لاعبون محترفون، وجماليات التصوير الرياضي الواقعي.',
    descriptionEn: 'Premium football stadiums, world-class players, and realistic sports photography aesthetics.',
    updatedAt: new Date().toISOString()
  },
  {
    gameId: 'subscriptions',
    category: 'subscriptions',
    nameAr: 'الاشتراكات والبطاقات الرقمية',
    nameEn: 'Digital Subscriptions & Cards',
    imageUrl: '/src/assets/images/digital_cards_showcase_1792944226065.jpg',
    genre: 'Digital Gift Cards & Subscriptions',
    accentColor: '#8b5cf6',
    descriptionAr: 'بطاقات هدايا رقمية فاخرة، اشتراكات ألعاب بأشكال ثلاثية الأبعاد ولمعان هولوجرافي مميز.',
    descriptionEn: 'Premium luxury digital gift cards and gaming vouchers with holographic metallic luster.',
    updatedAt: new Date().toISOString()
  }
];

// Default store settings
const DEFAULT_SETTINGS: StoreSettings = {
  paymentNumber: '31520844',
  whatsappNumber: '+22231520844',
  businessHoursAr: 'يومياً من 09:00 صباحاً حتى 02:00 فجراً بتوقيت موريتانيا',
  businessHoursEn: 'Daily from 09:00 AM to 02:00 AM GMT (Mauritania)',
  bankilyActive: true,
  masriviActive: true,
  sedadActive: true,
  storeOpen: true,
  minOrderMru: 45,
  autoFulfillmentEnabled: false
};

class DatabaseManager {
  private data: DbSchema = {
    users: [],
    products: [],
    gameArtworks: [],
    orders: [],
    orderHistory: [],
    announcements: [],
    supportTickets: [],
    auditLogs: [],
    settings: DEFAULT_SETTINGS
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure default products or updates are present
        if (!this.data.products || this.data.products.length === 0) {
          this.data.products = DEFAULT_PRODUCTS;
          this.persist();
        }
        if (!this.data.gameArtworks || this.data.gameArtworks.length === 0) {
          this.data.gameArtworks = DEFAULT_GAME_ARTWORKS;
          this.persist();
        } else {
          // Sync and ensure free_fire and efootball use official user images
          for (const defArt of DEFAULT_GAME_ARTWORKS) {
            const index = this.data.gameArtworks.findIndex(a => a.gameId === defArt.gameId);
            if (index === -1) {
              this.data.gameArtworks.push(defArt);
            } else if (defArt.gameId === 'free_fire' || defArt.gameId === 'efootball') {
              this.data.gameArtworks[index].imageUrl = defArt.imageUrl;
              this.data.gameArtworks[index].bannerUrl = defArt.bannerUrl;
            }
          }
        }
        // Update product images to match genre-specific artwork
        for (const p of this.data.products) {
          const artwork = this.data.gameArtworks.find(a => a.gameId === p.gameId);
          if (artwork) {
            if (p.gameId === 'free_fire' || p.gameId === 'efootball' || !p.image || p.image.includes('placeholder')) {
              p.image = artwork.imageUrl;
            }
          }
        }
        this.persist();

        if (!this.data.settings) {
          this.data.settings = DEFAULT_SETTINGS;
          this.persist();
        }
      } catch (e) {
        console.error('Failed to parse DB, bootstrapping fresh DB:', e);
        this.bootstrap();
      }
    } else {
      this.bootstrap();
    }
  }

  private bootstrap() {
    // Generate secure initial admin password
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ShadowStore2026!';
    const { hash, salt } = hashPassword(adminPassword);

    const adminUser = {
      id: 'admin_shadow_001',
      email: 'admin@shadowstore.mr',
      fullName: 'مدير متجر شادو ستور',
      phone: '31520844',
      role: 'admin' as const,
      languagePreference: 'ar' as const,
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt
    };

    const initialAnnouncement: Announcement = {
      id: 'ann-001',
      titleAr: 'تنبيه شحن فري فاير وببجي عبر بنكيلي ومصريفي وسداد',
      titleEn: 'Official Notice: Instant Bankily, Masrivi & Sedad Payments',
      contentAr: 'أهلاً بكم في متجر SHADOW STORE! رقم الدفع الرسمي لجميع التحويلات هو 31520844. يرجى إرفاق وصل التحويل أو رقم العملية لتنفيذ طلبك في أسرع وقت.',
      contentEn: 'Welcome to SHADOW STORE! The official payment number is 31520844. Attach your transfer reference or proof for swift fulfillment.',
      bannerType: 'info',
      active: true,
      createdAt: new Date().toISOString()
    };

    this.data = {
      users: [adminUser],
      products: DEFAULT_PRODUCTS,
      gameArtworks: DEFAULT_GAME_ARTWORKS,
      orders: [],
      orderHistory: [],
      announcements: [initialAnnouncement],
      supportTickets: [],
      auditLogs: [{
        id: 'audit_init',
        actorId: 'system',
        actorEmail: 'system@shadowstore.mr',
        action: 'STORE_INITIALIZED',
        entityType: 'settings',
        entityId: 'store',
        details: 'Store initialized with official Mauritanian gaming catalog & Free Fire exact prices.',
        createdAt: new Date().toISOString()
      }],
      settings: DEFAULT_SETTINGS
    };

    this.persist();
    console.log(`[Shadow Store] Initialized with admin credentials: admin@shadowstore.mr / ${adminPassword}`);
  }

  private persist() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // --- USERS & AUTH ---
  findUserByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === clean);
  }

  findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: 'admin' | 'customer';
    languagePreference?: 'ar' | 'en';
  }) {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }

    const { hash, salt } = hashPassword(userData.password);
    const newUser = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      email: userData.email.trim().toLowerCase(),
      fullName: userData.fullName.trim(),
      phone: userData.phone.trim(),
      role: userData.role || 'customer',
      languagePreference: userData.languagePreference || 'ar',
      savedPlayerIds: {},
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt
    };

    this.data.users.push(newUser);
    this.persist();

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return safeUser;
  }

  updateUserProfile(userId: string, updates: Partial<User>) {
    const index = this.data.users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    const user = this.data.users[index];
    this.data.users[index] = {
      ...user,
      ...updates,
      id: user.id, // prevent id overwrite
      passwordHash: user.passwordHash,
      salt: user.salt
    };
    this.persist();

    const { passwordHash: _, salt: __, ...safeUser } = this.data.users[index];
    return safeUser;
  }

  // --- PRODUCTS ---
  getProducts() {
    return this.data.products;
  }

  getProductById(id: string) {
    return this.data.products.find(p => p.id === id);
  }

  updateProduct(id: string, updates: Partial<Product>, actorEmail: string) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const oldProduct = this.data.products[index];
    this.data.products[index] = { ...oldProduct, ...updates };
    this.persist();

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'PRODUCT_UPDATED',
      entityType: 'product',
      entityId: id,
      details: `Updated product ${oldProduct.nameAr} (${id})`
    });

    return this.data.products[index];
  }

  createProduct(product: Omit<Product, 'id'>, actorEmail: string) {
    const newProduct: Product = {
      ...product,
      id: `prod_${crypto.randomBytes(5).toString('hex')}`
    };
    this.data.products.push(newProduct);
    this.persist();

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'PRODUCT_CREATED',
      entityType: 'product',
      entityId: newProduct.id,
      details: `Created product ${newProduct.nameAr}`
    });

    return newProduct;
  }

  // --- DYNAMIC GAME ARTWORK SYSTEM ---
  getGameArtworks() {
    return this.data.gameArtworks;
  }

  getGameArtwork(gameId: string) {
    return this.data.gameArtworks.find(a => a.gameId === gameId);
  }

  updateGameArtwork(gameId: string, updates: Partial<GameArtwork>, actorEmail: string) {
    const index = this.data.gameArtworks.findIndex(a => a.gameId === gameId);
    if (index === -1) return null;

    const oldArtwork = this.data.gameArtworks[index];
    const updatedArtwork: GameArtwork = {
      ...oldArtwork,
      ...updates,
      gameId: oldArtwork.gameId,
      updatedAt: new Date().toISOString()
    };
    this.data.gameArtworks[index] = updatedArtwork;

    // If imageUrl was updated, synchronize all products belonging to this game
    if (updates.imageUrl) {
      for (const prod of this.data.products) {
        if (prod.gameId === gameId) {
          prod.image = updates.imageUrl;
        }
      }
    }

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'GAME_ARTWORK_UPDATED',
      entityType: 'settings',
      entityId: gameId,
      details: `Updated promotional artwork for game ${oldArtwork.nameAr} (${gameId})`
    });

    this.persist();
    return updatedArtwork;
  }

  updateProductArtwork(productId: string, imageUrl: string, actorEmail: string) {
    const prod = this.getProductById(productId);
    if (!prod) return null;

    prod.image = imageUrl;
    this.persist();

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'PRODUCT_ARTWORK_UPDATED',
      entityType: 'product',
      entityId: productId,
      details: `Updated specific artwork for product ${prod.nameAr}`
    });

    return prod;
  }

  // --- ORDERS & SERVER-SIDE PRICE CALCULATION ---
  calculateServerPrice(items: Array<{ productId: string; quantity: number }>): {
    totalMru: number;
    validatedItems: Array<{ product: Product; quantity: number; subtotal: number }>;
  } {
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`المنتج غير موجود: ${item.productId}`);
      }
      if (!product.isAvailable) {
        throw new Error(`المنتج غير متاح حالياً: ${product.nameAr}`);
      }
      const qty = Math.max(1, Math.min(item.quantity || 1, 10)); // bounds check
      const subtotal = product.priceMru * qty;
      total += subtotal;
      validatedItems.push({ product, quantity: qty, subtotal });
    }

    return { totalMru: total, validatedItems };
  }

  createOrder(orderData: {
    userId?: string;
    customerName: string;
    customerPhone: string;
    playerId?: string;
    serverZone?: string;
    accountEmail?: string;
    accountPassword?: string;
    deliveryMethod: 'player_id' | 'account_login';
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: 'bankily' | 'masrivi' | 'sedad';
    paymentPhone?: string;
    paymentTxRef?: string;
    paymentProofUrl?: string;
    customerNotes?: string;
  }) {
    // 1. Recalculate price strictly on server
    const { totalMru, validatedItems } = this.calculateServerPrice(orderData.items);

    // 2. Generate unique human-readable order reference: SHW-XXXXXX
    const orderRef = `SHW-${Math.floor(100000 + Math.random() * 900000)}`;
    // 4-digit verification PIN for guest or secure tracking
    const verificationPin = `${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const formattedItems = validatedItems.map(vi => ({
      productId: vi.product.id,
      productNameAr: vi.product.nameAr,
      productNameEn: vi.product.nameEn,
      amount: vi.product.amount,
      unit: vi.product.unit,
      deliveryMethod: vi.product.deliveryMethod,
      priceMru: vi.product.priceMru,
      quantity: vi.quantity
    }));

    // In accordance with guidelines: Status starts as awaiting_payment or needs_review.
    // Never auto-confirm submitted proof as completed payment.
    const initialStatus: OrderStatus = orderData.paymentProofUrl || orderData.paymentTxRef
      ? 'awaiting_payment'
      : 'awaiting_payment';

    const newOrder: Order = {
      id: `ord_${crypto.randomBytes(8).toString('hex')}`,
      orderRef,
      verificationPin,
      userId: orderData.userId,
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      playerId: orderData.playerId?.trim(),
      serverZone: orderData.serverZone?.trim(),
      accountEmail: orderData.accountEmail?.trim(),
      deliveryMethod: orderData.deliveryMethod,
      items: formattedItems,
      totalMru,
      paymentMethod: orderData.paymentMethod,
      paymentPhone: orderData.paymentPhone?.trim(),
      paymentTxRef: orderData.paymentTxRef?.trim(),
      paymentProofUrl: orderData.paymentProofUrl,
      status: initialStatus,
      customerNotes: orderData.customerNotes?.trim(),
      createdAt: now,
      updatedAt: now
    };

    this.data.orders.unshift(newOrder);

    // Log history
    this.data.orderHistory.push({
      id: `hist_${crypto.randomBytes(6).toString('hex')}`,
      orderId: newOrder.id,
      orderRef: newOrder.orderRef,
      previousStatus: null,
      newStatus: initialStatus,
      changedBy: 'customer',
      reason: 'إنشاء الطلب وتقديم تفاصيل الدفع',
      createdAt: now
    });

    this.persist();

    return newOrder;
  }

  // Secure order tracking lookup by orderRef and verification factor (Phone or PIN)
  findOrderByTracking(orderRef: string, verificationFactor: string) {
    const cleanRef = orderRef.trim().toUpperCase();
    const cleanFactor = verificationFactor.trim().toLowerCase();

    const order = this.data.orders.find(o => o.orderRef.toUpperCase() === cleanRef);
    if (!order) return null;

    // Verify phone or PIN
    const phoneMatches = order.customerPhone.replace(/[^0-9]/g, '').includes(cleanFactor.replace(/[^0-9]/g, ''));
    const pinMatches = order.verificationPin === cleanFactor;

    if (!phoneMatches && !pinMatches) {
      return 'UNAUTHORIZED';
    }

    return order;
  }

  getOrders(filters?: { status?: OrderStatus; userId?: string }) {
    let list = [...this.data.orders];
    if (filters?.status) {
      list = list.filter(o => o.status === filters.status);
    }
    if (filters?.userId) {
      list = list.filter(o => o.userId === filters.userId);
    }
    return list;
  }

  getOrderById(id: string) {
    return this.data.orders.find(o => o.id === id || o.orderRef === id);
  }

  updateOrderStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    actorEmail: string, 
    adminNotes?: string,
    reason?: string
  ) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const prevStatus = order.status;
    const now = new Date().toISOString();

    order.status = newStatus;
    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }
    order.updatedAt = now;

    this.data.orderHistory.push({
      id: `hist_${crypto.randomBytes(6).toString('hex')}`,
      orderId: order.id,
      orderRef: order.orderRef,
      previousStatus: prevStatus,
      newStatus,
      changedBy: actorEmail,
      reason: reason || `تغيير الحالة إلى ${newStatus}`,
      createdAt: now
    });

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'ORDER_STATUS_CHANGED',
      entityType: 'order',
      entityId: order.id,
      details: `Changed order ${order.orderRef} from ${prevStatus} to ${newStatus}. Note: ${adminNotes || 'none'}`
    });

    this.persist();
    return order;
  }

  getOrderHistory(orderId: string) {
    const order = this.getOrderById(orderId);
    if (!order) return [];
    return this.data.orderHistory
      .filter(h => h.orderId === order.id || h.orderRef === order.orderRef)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // --- ANNOUNCEMENTS ---
  getAnnouncements() {
    return this.data.announcements.filter(a => a.active);
  }

  getAllAnnouncements() {
    return this.data.announcements;
  }

  saveAnnouncement(ann: Announcement, actorEmail: string) {
    const existingIndex = this.data.announcements.findIndex(a => a.id === ann.id);
    if (existingIndex >= 0) {
      this.data.announcements[existingIndex] = ann;
    } else {
      this.data.announcements.unshift(ann);
    }
    this.persist();

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'ANNOUNCEMENT_SAVED',
      entityType: 'announcement',
      entityId: ann.id,
      details: `Saved announcement: ${ann.titleAr}`
    });
    return ann;
  }

  deleteAnnouncement(id: string, actorEmail: string) {
    this.data.announcements = this.data.announcements.filter(a => a.id !== id);
    this.persist();
    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'ANNOUNCEMENT_DELETED',
      entityType: 'announcement',
      entityId: id,
      details: `Deleted announcement ${id}`
    });
  }

  // --- SUPPORT TICKETS ---
  createSupportTicket(ticketData: {
    customerName: string;
    customerPhone: string;
    orderRef?: string;
    subject: string;
    message: string;
  }) {
    const ticketRef = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: `tck_${crypto.randomBytes(6).toString('hex')}`,
      ticketRef,
      customerName: ticketData.customerName.trim(),
      customerPhone: ticketData.customerPhone.trim(),
      orderRef: ticketData.orderRef?.trim(),
      subject: ticketData.subject.trim(),
      message: ticketData.message.trim(),
      status: 'open',
      createdAt: now,
      updatedAt: now
    };

    this.data.supportTickets.unshift(newTicket);
    this.persist();
    return newTicket;
  }

  getSupportTickets() {
    return this.data.supportTickets;
  }

  replySupportTicket(ticketId: string, response: string, status: 'answered' | 'closed', actorEmail: string) {
    const ticket = this.data.supportTickets.find(t => t.id === ticketId || t.ticketRef === ticketId);
    if (!ticket) return null;

    ticket.adminResponse = response;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    this.persist();

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'TICKET_REPLIED',
      entityType: 'ticket',
      entityId: ticket.id,
      details: `Replied to ticket ${ticket.ticketRef} and set status to ${status}`
    });

    return ticket;
  }

  // --- AUDIT LOGS ---
  logAudit(log: Omit<AuditLog, 'id' | 'createdAt'>) {
    const newLog: AuditLog = {
      ...log,
      id: `aud_${crypto.randomBytes(6).toString('hex')}`,
      createdAt: new Date().toISOString()
    };
    this.data.auditLogs.unshift(newLog);
    // Keep max 1000 logs
    if (this.data.auditLogs.length > 1000) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 1000);
    }
    this.persist();
    return newLog;
  }

  getAuditLogs(limit = 100) {
    return this.data.auditLogs.slice(0, limit);
  }

  // --- SETTINGS ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates: Partial<StoreSettings>, actorEmail: string) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.persist();

    this.logAudit({
      actorId: 'admin',
      actorEmail,
      action: 'SETTINGS_UPDATED',
      entityType: 'settings',
      entityId: 'store_settings',
      details: `Updated store configuration`
    });

    return this.data.settings;
  }

  // --- REAL-TIME ANALYTICS (CALCULATED FROM DB RECORDS) ---
  getAnalytics() {
    const orders = this.data.orders;
    const completedOrders = orders.filter(o => o.status === 'completed');
    const awaitingPaymentOrders = orders.filter(o => o.status === 'awaiting_payment' || o.status === 'needs_review');
    const inProgressOrders = orders.filter(o => o.status === 'in_progress');

    const totalRevenueMru = completedOrders.reduce((sum, o) => sum + o.totalMru, 0);
    const pendingReviewVolumeMru = awaitingPaymentOrders.reduce((sum, o) => sum + o.totalMru, 0);

    // Group sales by category
    const salesByCategory: Record<string, number> = {};
    for (const order of completedOrders) {
      for (const item of order.items) {
        const prod = this.getProductById(item.productId);
        const cat = prod?.category || 'other';
        salesByCategory[cat] = (salesByCategory[cat] || 0) + item.priceMru * item.quantity;
      }
    }

    // Payment method distribution
    const paymentMethodsCount: Record<string, number> = {
      bankily: orders.filter(o => o.paymentMethod === 'bankily').length,
      masrivi: orders.filter(o => o.paymentMethod === 'masrivi').length,
      sedad: orders.filter(o => o.paymentMethod === 'sedad').length
    };

    return {
      totalOrders: orders.length,
      completedOrdersCount: completedOrders.length,
      awaitingPaymentCount: awaitingPaymentOrders.length,
      inProgressCount: inProgressOrders.length,
      totalRevenueMru,
      pendingReviewVolumeMru,
      salesByCategory,
      paymentMethodsCount,
      totalCustomers: this.data.users.filter(u => u.role === 'customer').length,
      openTicketsCount: this.data.supportTickets.filter(t => t.status === 'open').length
    };
  }
}

export const db = new DatabaseManager();
