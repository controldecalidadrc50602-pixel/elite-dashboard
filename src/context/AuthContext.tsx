import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null | any; // Any for mock user
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo Mode: Check local storage for mock user
      const mockUser = localStorage.getItem('demo_user');
      if (mockUser) setUser(JSON.parse(mockUser));
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      // Demo Mode Fallback
      if (email === 'admin@admin.com' && pass === 'admin') {
        const mockUser = { email: 'admin@admin.com', id: '123-demo' };
        setUser(mockUser as any);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { error: null };
      }
      return { error: { message: 'Invalid credentials in Demo Mode' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { error };
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      localStorage.removeItem('demo_user');
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
