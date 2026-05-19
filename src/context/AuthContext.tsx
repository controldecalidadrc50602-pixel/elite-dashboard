import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';
import { ADMIN_UIDS, AUTHORIZED_EMAILS } from '../config/roles';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdTokenResult(firebaseUser);
        
        // Verificación de RBAC contra los UIDs y Correos
        const userEmail = firebaseUser.email?.toLowerCase() || '';
        
        const isPredefinedAdmin = ADMIN_UIDS.includes(firebaseUser.uid) || 
                                  AUTHORIZED_EMAILS.includes(userEmail);
                                  
        const adminStatus = !!token.claims.admin || isPredefinedAdmin;
        
        // Aquí puedes definir si solo los administradores pueden entrar
        // O si hay correos invitados en la lista AUTHORIZED_EMAILS
        const hasAccess = isPredefinedAdmin || AUTHORIZED_EMAILS.includes(userEmail);

        if (hasAccess) {
          setUser(firebaseUser);
          setIsAdmin(adminStatus);
          setIsAuthorized(true);
        } else {
          // Si entra alguien no autorizado por Google, lo deslogueamos automáticamente por seguridad
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          setIsAuthorized(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      const userEmail = result.user.email?.toLowerCase() || '';
      const isAllowed = ADMIN_UIDS.includes(result.user.uid) || AUTHORIZED_EMAILS.includes(userEmail);
      
      if (!isAllowed) {
        await signOut(auth);
        return { error: { message: 'unauthorized_domain_or_user' } };
      }

      return { error: null };
    } catch (error) {
      console.error('Google login error:', error);
      return { error };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGoogle,
      logout, 
      isAuthenticated: !!user && isAuthorized,
      isAdmin,
      isAuthorized
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


