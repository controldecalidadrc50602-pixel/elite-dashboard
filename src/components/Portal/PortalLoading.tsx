interface PortalLoadingProps {
  clientName?: string;
  logoUrl?: string | null;
}

const PortalLoading = ({ clientName, logoUrl }: PortalLoadingProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing glow effect using native CSS pulse */}
        <div className="absolute w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
        
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
      </div>
      
      <p className="mt-8 text-white/40 font-light tracking-[0.2em] text-sm uppercase animate-pulse">
        Estableciendo conexión
      </p>
    </div>
  );
};

export default PortalLoading;
