import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandingService, BrandingConfig } from '../services/brandingService';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState<BrandingConfig>(brandingService.defaultConfig);
  const { login, loginWithGoogle } = useAuth();

  useEffect(() => {
    const unsub = brandingService.subscribeToBranding(setBranding);
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: authError } = await login(email, password);
    
    if (authError) {
      setError('Acceso denegado. Verifique sus credenciales.');
      setLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error: authError } = await loginWithGoogle();
    if (authError) {
      if (authError.includes('popup-closed-by-user')) {
        setError('El proceso de autenticación fue cancelado.');
      } else {
        setError('Error al conectar con Google. Verifique los pop-ups.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Dynamic Cinematic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rc-teal/10 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-[420px] p-10 rounded-[48px] relative z-10 border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
      >
        {/* Identity Section */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-24 h-24 bg-[var(--bg-secondary)] rounded-[2.5rem] flex items-center justify-center mb-6 border border-white/10 relative shadow-2xl overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-rc-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             {branding.logoUrl ? (
               <img src={branding.logoUrl} alt="Logo" className="w-16 h-16 object-contain relative z-10" />
             ) : (
               <div className="w-14 h-14 bg-rc-teal rounded-3xl flex items-center justify-center text-black font-semibold text-2xl shadow-[0_0_20px_rgba(59,199,170,0.4)] relative z-10">Rc</div>
             )}
          </motion.div>
          
          <h1 className="text-4xl font-semibold text-white tracking-tight uppercase mb-2">Elite Access</h1>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-rc-teal" />
            <p className="label-executive">{branding.companyName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rc-teal transition-colors z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-rc-teal/40 transition-all text-sm font-semibold placeholder:text-slate-600"
                placeholder="Identificador Corporativo"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rc-teal transition-colors z-10" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#0d1117] border ${error ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-rc-teal/40 transition-all text-sm font-semibold placeholder:text-slate-600`}
                placeholder="Clave de Seguridad"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-500 text-[10px] font-black uppercase tracking-wider text-center">
                  ⚠️ {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-200 active:scale-95"
          >
            {loading ? 'Validando Acceso...' : 'Sincronizar Panel'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center">
            <span className="bg-[#020617] px-6 label-executive">Direct Login</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium py-5 rounded-2xl flex items-center justify-center gap-4 transition-all text-[11px] uppercase tracking-widest shadow-lg hover:shadow-white/10 active:scale-[0.98]"
        >
          <GoogleIcon />
          Entrar con Google
        </button>

        <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
          <p className="label-executive">
            Elite Dashboard V4.0 • Executive Edition
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


