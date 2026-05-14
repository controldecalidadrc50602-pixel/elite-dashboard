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
        setIsAdmin(parsed.email === 'admin@admin.com');
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await getIdTokenResult(firebaseUser);
        setIsAdmin(!!token.claims.admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      if (email === 'admin@admin.com' && pass === 'admin') {
        const mockUser = { email: 'admin@admin.com', uid: '123-demo', displayName: 'Admin User' };
        setUser(mockUser as any);
        setIsAdmin(true);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { error: null };
      }
      return { error: { message: 'Invalid credentials in Demo Mode' } };
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
      await signInWithPopup(auth, googleProvider);
      return { error: null };
    } catch (error) {
      console.error('Google login error:', error);
      return { error };
    }
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

