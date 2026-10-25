import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Hero } from './components/Hero.tsx';
import { GameCatalog } from './components/GameCatalog.tsx';
import { EFootballPromoBanner } from './components/EFootballPromoBanner.tsx';
import { OrderTracker } from './components/OrderTracker.tsx';
import { SupportSection } from './components/SupportSection.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import type { Product, Order } from './types/index.ts';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'track' | 'support' | 'account' | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Tracker pre-fill
  const [trackRef, setTrackRef] = useState('');
  const [trackPin, setTrackPin] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStartRecharge = () => {
    setActiveTab('catalog');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrackOrderFromReceipt = (ref: string, pin: string) => {
    setTrackRef(ref);
    setTrackPin(pin);
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#e0e2ec] pb-16 md:pb-0">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Primary Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onStartRecharge={handleStartRecharge}
              onTrackOrder={() => setActiveTab('track')}
            />
            {/* Featured eFootball Promotion Banner */}
            <EFootballPromoBanner
              products={products}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
            {/* Complete Game Catalog with exact pricing */}
            <GameCatalog
              products={products}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
            {/* Support section teaser */}
            <SupportSection />
          </>
        )}

        {activeTab === 'catalog' && (
          <div className="py-6">
            <GameCatalog
              products={products}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
          </div>
        )}

        {activeTab === 'track' && (
          <OrderTracker
            initialOrderRef={trackRef}
            initialPin={trackPin}
          />
        )}

        {activeTab === 'support' && (
          <SupportSection />
        )}

        {activeTab === 'account' && (
          <CustomerDashboard
            onTrackOrder={handleTrackOrderFromReceipt}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab as any)} />

      {/* Mobile Bottom Navigation for Thumb Ergonomics */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrderCreated={(order) => {
            setSelectedProduct(null);
            setCreatedOrder(order);
          }}
        />
      )}

      {/* Order Created Success Dialog */}
      {createdOrder && (
        <OrderSuccessModal
          order={createdOrder}
          onClose={() => setCreatedOrder(null)}
          onTrackOrder={handleTrackOrderFromReceipt}
        />
      )}

      {/* Login & Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
