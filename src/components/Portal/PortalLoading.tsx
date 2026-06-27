import { motion } from 'framer-motion';

interface PortalLoadingProps {
  clientName?: string;
  logoUrl?: string | null;
}

const PortalLoading = ({ clientName, logoUrl }: PortalLoadingProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Pulsing glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl"
        />
        
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={clientName || 'Cargando...'} 
            className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-md">
            <span className="text-3xl text-white/50 font-light tracking-widest">
              {clientName ? clientName.charAt(0).toUpperCase() : 'C'}
            </span>
          </div>
        )}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-8 text-white/40 font-light tracking-[0.2em] text-sm uppercase"
      >
        Estableciendo conexión
      </motion.p>
    </div>
  );
};

export default PortalLoading;
