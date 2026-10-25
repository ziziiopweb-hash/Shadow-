# SHADOW STORE — Deployment & Production Guide

This guide documents the architecture, database migrations, credentials, and deployment procedures for **SHADOW STORE** (Mauritania's Premier Digital Gaming Recharge Platform).

---

## 1. Environment Variables Configuration

Copy `.env.example` to `.env` or set these in your hosting environment (e.g., Vercel, Railway, Cloud Run):

```bash
# Server Port & Mode
PORT=3000
NODE_ENV=production

# Security & Sessions
JWT_SECRET="your_strong_random_secret_here"
ADMIN_INITIAL_PASSWORD="YourSecureAdminPassword2026!"

# Optional Official Provider API Integrations
# (Leave blank for standard manual verification via Bankily/Masrivi/Sedad)
GARENA_TOPUP_API_KEY=""
PUBG_MIDASBUY_API_KEY=""
BANKILY_MERCHANT_ID=""
MASRIVI_MERCHANT_KEY=""
```

---

## 2. Default Administrator Credentials

Upon initial launch, SHADOW STORE provisions a secure administrator account:
- **Email**: `admin@shadowstore.mr`
- **Password**: `ShadowStore2026!` (or the value of `ADMIN_INITIAL_PASSWORD`)
- **Admin Dashboard**: Accessible directly from the navigation bar or at `#admin`

---

## 3. Official Mauritania Payment Information

- **Bankily (بنكيلي)**: `31520844`
- **Masrivi (مصريفي)**: `31520844`
- **Sedad (سداد)**: `31520844`
- **Customer WhatsApp Hotline**: `+222 31520844`
- **Business Hours**: 09:00 AM - 02:00 AM GMT (Mauritania)

---

## 4. Supabase / PostgreSQL Setup

To deploy on Supabase:
1. Create a new project in your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy the entire contents of `/database/supabase_schema.sql` and run it.
4. All tables, constraints, ENUMs, indexes, and exact Free Fire pricing will be created.

---

## 5. Vercel Deployment Instructions

1. Push this repository to GitHub or GitLab.
2. In Vercel, click **Add New Project** and select this repository.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set `JWT_SECRET` and `ADMIN_INITIAL_PASSWORD` in the Project Settings under **Environment Variables**.
6. Click **Deploy**.

---

## 6. Payment Verification & Fulfillment Workflow

1. Customers select their game and desired package.
2. The server strictly recalculates and validates the total amount in **MRU**.
3. The customer sends the amount via **Bankily**, **Masrivi**, or **Sedad** to **31520844**.
4. The customer attaches the sender phone, transaction reference, or receipt screenshot.
5. In accordance with strict security standards, submitted proof is **never** automatically marked as completed payment.
6. The store admin reviews the payment proof in the Admin Dashboard, checks the bank ledger, and updates the status:
   - `awaiting_payment` $\to$ `in_progress` $\to$ `completed`
7. In case of discrepancies, the status is set to `needs_review` or `rejected` with custom notes visible to the customer.
