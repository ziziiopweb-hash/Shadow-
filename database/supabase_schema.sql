-- =========================================================================
-- SHADOW STORE - SUPABASE / POSTGRESQL PRODUCTION DATABASE SCHEMA & MIGRATIONS
-- Mauritania's Premier Digital Gaming Recharge Platform
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'awaiting_payment',
    'in_progress',
    'completed',
    'rejected',
    'cancelled',
    'needs_review'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('bankily', 'masrivi', 'sedad');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_method AS ENUM ('player_id', 'account_login');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt VARCHAR(64) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  role user_role DEFAULT 'customer',
  language_preference VARCHAR(10) DEFAULT 'ar',
  saved_player_ids JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(80) PRIMARY KEY,
  game_id VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  type VARCHAR(50) NOT NULL,
  delivery_method delivery_method DEFAULT 'player_id',
  price_mru NUMERIC(10, 2) NOT NULL CHECK (price_mru > 0),
  original_price_mru NUMERIC(10, 2),
  amount VARCHAR(50) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  required_fields TEXT[] DEFAULT ARRAY['player_id']::TEXT[],
  badge VARCHAR(80),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref VARCHAR(30) UNIQUE NOT NULL,
  verification_pin VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  player_id VARCHAR(100),
  server_zone VARCHAR(50),
  account_email VARCHAR(255),
  delivery_method delivery_method DEFAULT 'player_id',
  items JSONB NOT NULL,
  total_mru NUMERIC(10, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_phone VARCHAR(50),
  payment_tx_ref VARCHAR(100),
  payment_proof_url TEXT,
  status order_status DEFAULT 'awaiting_payment',
  admin_notes TEXT,
  customer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  order_ref VARCHAR(30) NOT NULL,
  previous_status order_status,
  new_status order_status NOT NULL,
  changed_by VARCHAR(150) NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  content_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  banner_type VARCHAR(20) DEFAULT 'info',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_ref VARCHAR(30) UNIQUE NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  order_ref VARCHAR(30),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id VARCHAR(100) NOT NULL,
  actor_email VARCHAR(150) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  payment_number VARCHAR(30) DEFAULT '31520844',
  whatsapp_number VARCHAR(30) DEFAULT '+22231520844',
  business_hours_ar VARCHAR(255) DEFAULT 'يومياً من 09:00 صباحاً حتى 02:00 فجراً بتوقيت موريتانيا',
  business_hours_en VARCHAR(255) DEFAULT 'Daily from 09:00 AM to 02:00 AM GMT',
  bankily_active BOOLEAN DEFAULT true,
  masrivi_active BOOLEAN DEFAULT true,
  sedad_active BOOLEAN DEFAULT true,
  store_open BOOLEAN DEFAULT true,
  min_order_mru NUMERIC(10,2) DEFAULT 45,
  auto_fulfillment_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- =========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders (order_ref);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category, is_available);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ref ON support_tickets (ticket_ref);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);

-- =========================================================================
-- SEED EXACT FREE FIRE PRICING (Official Shadow Store Data)
-- =========================================================================
INSERT INTO products (id, game_id, category, name_ar, name_en, type, delivery_method, price_mru, amount, unit, is_available) VALUES
  ('ff-dia-110', 'free_fire', 'free_fire', '110 جوهرة فري فاير', '110 Free Fire Diamonds', 'diamonds', 'player_id', 50.00, '110', 'جوهرة', true),
  ('ff-dia-220', 'free_fire', 'free_fire', '220 جوهرة فري فاير', '220 Free Fire Diamonds', 'diamonds', 'player_id', 100.00, '220', 'جوهرة', true),
  ('ff-dia-330', 'free_fire', 'free_fire', '330 جوهرة فري فاير', '330 Free Fire Diamonds', 'diamonds', 'player_id', 150.00, '330', 'جوهرة', true),
  ('ff-dia-440', 'free_fire', 'free_fire', '440 جوهرة فري فاير', '440 Free Fire Diamonds', 'diamonds', 'player_id', 200.00, '440', 'جوهرة', true),
  ('ff-dia-1166', 'free_fire', 'free_fire', '1166 جوهرة فري فاير', '1166 Free Fire Diamonds', 'diamonds', 'player_id', 500.00, '1166', 'جوهرة', true),
  ('ff-dia-1386', 'free_fire', 'free_fire', '1386 جوهرة فري فاير', '1386 Free Fire Diamonds', 'diamonds', 'player_id', 600.00, '1386', 'جوهرة', true),
  ('ff-dia-1606', 'free_fire', 'free_fire', '1606 جوهرة فري فاير', '1606 Free Fire Diamonds', 'diamonds', 'player_id', 700.00, '1606', 'جوهرة', true),
  ('ff-dia-2368', 'free_fire', 'free_fire', '2368 جوهرة فري فاير', '2368 Free Fire Diamonds', 'diamonds', 'player_id', 1000.00, '2368', 'جوهرة', true),
  ('ff-mem-week-id', 'free_fire', 'free_fire', 'عضوية فري فاير أسبوعية (عبر الـ ID)', 'Free Fire Weekly Membership (via ID)', 'membership', 'player_id', 120.00, 'أسبوعية ID', 'عضوية', true),
  ('ff-mem-month-id', 'free_fire', 'free_fire', 'عضوية فري فاير شهرية (عبر الـ ID)', 'Free Fire Monthly Membership (via ID)', 'membership', 'player_id', 450.00, 'شهرية ID', 'عضوية', true),
  ('ff-mem-week-acc', 'free_fire', 'free_fire', 'عضوية فري فاير أسبوعية (عبر الحساب)', 'Free Fire Weekly Membership (via Account)', 'membership', 'account_login', 100.00, 'أسبوعية حساب', 'عضوية', true),
  ('ff-mem-month-acc', 'free_fire', 'free_fire', 'عضوية فري فاير شهرية (عبر الحساب)', 'Free Fire Monthly Membership (via Account)', 'membership', 'account_login', 400.00, 'شهرية حساب', 'عضوية', true),
  ('ff-booyah-pass', 'free_fire', 'free_fire', 'بطاقة بويا باس (Booyah Pass)', 'Free Fire Booyah Pass', 'battle_pass', 'player_id', 150.00, 'الموسم الحالي', 'تذكرة', true)
ON CONFLICT (id) DO UPDATE SET price_mru = EXCLUDED.price_mru;

INSERT INTO store_settings (id, payment_number, whatsapp_number) 
VALUES (1, '31520844', '+22231520844')
ON CONFLICT (id) DO NOTHING;
