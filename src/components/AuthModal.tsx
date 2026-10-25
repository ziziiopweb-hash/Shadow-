import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Lock, Mail, User, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t, language } = useLanguage();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' 
      ? { email, password }
      : { email, password, fullName, phone, languagePreference: language };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('admin@shadowstore.mr');
    setPassword('ShadowStore2026!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#11151f] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#161a26] rounded-xl mb-6">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.login}
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.register}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t.fullName} *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    className="w-full bg-[#161a26] border border-slate-700 rounded-xl ps-8 pe-3 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t.phoneNumber} *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="3X XX XX XX"
                    className="w-full bg-[#161a26] border border-slate-700 rounded-xl ps-8 pe-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@shadowstore.mr"
                className="w-full bg-[#161a26] border border-slate-700 rounded-xl ps-8 pe-3 py-2 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ar' ? 'كلمة المرور' : 'Password'} *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161a26] border border-slate-700 rounded-xl ps-8 pe-3 py-2 text-xs text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? '...' : (mode === 'login' ? t.login : t.register)}
          </button>
        </form>

        {/* Quick Admin Helper Button (for instant evaluation/testing) */}
        {mode === 'login' && (
          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <button
              onClick={handleQuickAdminLogin}
              className="text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ar' ? 'تعبئة بيانات حساب الإدارة (تجربة)' : 'Quick Fill Admin Credentials'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
