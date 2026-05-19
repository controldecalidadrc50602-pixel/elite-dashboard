import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured, googleProvider } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null | any; // Any for mock user
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Demo Mode
      const mockUser = localStorage.getItem('demo_user');
      if (mockUser) {
        const parsed = JSON.parse(mockUser);
        setUser(parsed);
        setIsAdmin(parsed.email === 'ceo@admin.com' || parsed.email === 'developer@admin.com');
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await getIdTokenResult(firebaseUser);
        const isPredefinedAdmin = firebaseUser.email === 'ceo@admin.com' || firebaseUser.email === 'developer@admin.com';
        setIsAdmin(!!token.claims.admin || isPredefinedAdmin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      // Admin 1: ceo@admin.com / Rc506CR
      if (email === 'ceo@admin.com' && pass === 'Rc506CR') {
        const mockUser = { email: 'ceo@admin.com', uid: 'ceo-demo', displayName: 'CEO - Rc506' };
        setUser(mockUser as any);
        setIsAdmin(true);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { error: null };
      }
      
      // Admin 2: developer@admin.com / Rc506Vzla
      if (email === 'developer@admin.com' && pass === 'Rc506Vzla') {
        const mockUser = { email: 'developer@admin.com', uid: 'dev-demo', displayName: 'Developer - Rc506' };
        setUser(mockUser as any);
        setIsAdmin(true);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { error: null };
      }

      // Any other combination represents standard Read-Only Consultant
      const mockUser = { email, uid: 'consultant-demo', displayName: 'Auditor Consultor' };
      setUser(mockUser as any);
      setIsAdmin(false);
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      return { error: null };
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      return { error: { message: 'Google login not available in Demo Mode' } };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isPredefinedAdmin = result.user.email === 'ceo@admin.com' || result.user.email === 'developer@admin.com';
      const token = await getIdTokenResult(result.user);
      setIsAdmin(!!token.claims.admin || isPredefinedAdmin);
      return { error: null };
    } catch (error) {
      console.error('Google login error:', error);
      return { error };
    }
  };

  const loginAsGuest = async () => {
    const guestUser = { 
      email: 'invitado@rc506.com', 
      uid: 'guest-invite-token', 
      displayName: 'Invitado Especial' 
    };
    setUser(guestUser as any);
    setIsAdmin(false);
    localStorage.setItem('demo_user', JSON.stringify(guestUser));
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('demo_user');
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGoogle,
      loginAsGuest,
      logout, 
      isAuthenticated: !!user,
      isAdmin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

