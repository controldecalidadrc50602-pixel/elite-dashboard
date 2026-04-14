import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

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
      setError('Error al conectar con Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rc-teal/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-sm p-10 rounded-[40px] relative z-10 border border-white/5 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-rc-teal/10 rounded-3xl flex items-center justify-center mb-6 border border-rc-teal/20 relative group">
             <div className="absolute inset-0 bg-rc-teal/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-12 h-12 bg-rc-teal rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg relative z-10">Rc</div>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Elite Access</h1>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-rc-teal" />
            <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-[0.3em]">Rc506 Solutions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-rc-teal/40 transition-all text-sm font-medium placeholder:text-slate-600"
                placeholder="Identificador Corporativo"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black/20 border ${error ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-rc-teal/40 transition-all text-sm font-medium placeholder:text-slate-600`}
                placeholder="Clave de Seguridad"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-rose-500 text-[10px] font-black uppercase tracking-wider text-center"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/30 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[10px] tracking-widest"
          >
            {loading ? 'Sincronizando...' : 'Iniciar Sesión'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
            <span className="bg-[#0f172a] px-4">Acceso Alternativo</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all text-[10px] uppercase tracking-widest group"
        >
          <Chrome size={18} className="text-rc-teal group-hover:rotate-12 transition-transform" />
          Acceso con Google
        </button>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            Elite Dashboard V3.5
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

