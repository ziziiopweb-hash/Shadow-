import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Order } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  savedPlayerIds: Record<string, string>;
  savePlayerId: (gameId: string, playerId: string) => void;
  refreshUserData: () => Promise<void>;
  cartCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('shadow_store_token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('shadow_store_user');
    return raw ? JSON.parse(raw) : null;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const raw = localStorage.getItem('shadow_store_favs');
    return raw ? JSON.parse(raw) : [];
  });

  const [savedPlayerIds, setSavedPlayerIds] = useState<Record<string, string>>(() => {
    const raw = localStorage.getItem('shadow_store_ids');
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('shadow_store_token', token);
    } else {
      localStorage.removeItem('shadow_store_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shadow_store_user', JSON.stringify(user));
      if (user.savedPlayerIds) {
        setSavedPlayerIds(prev => ({ ...prev, ...user.savedPlayerIds }));
      }
    } else {
      localStorage.removeItem('shadow_store_user');
    }
  }, [user]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('shadow_store_token');
    localStorage.removeItem('shadow_store_user');
  };

  const updateUser = (updated: User) => {
    setUser(updated);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('shadow_store_favs', JSON.stringify(next));
      return next;
    });
  };

  const savePlayerId = (gameId: string, playerId: string) => {
    const next = { ...savedPlayerIds, [gameId]: playerId };
    setSavedPlayerIds(next);
    localStorage.setItem('shadow_store_ids', JSON.stringify(next));

    // If logged in, sync with server profile
    if (token && user) {
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ savedPlayerIds: next })
      }).catch(err => console.error('Failed to sync player ID:', err));
    }
  };

  const refreshUserData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401) {
        logout();
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAdmin,
      login,
      logout,
      updateUser,
      favorites,
      toggleFavorite,
      savedPlayerIds,
      savePlayerId,
      refreshUserData,
      cartCount: 0
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
