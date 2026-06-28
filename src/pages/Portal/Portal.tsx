import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { portalService } from '../../services/portalService';
import PortalLoading from '../../components/Portal/PortalLoading';
import PortalErrorBoundary from '../../components/Portal/PortalErrorBoundary';

// ============================================================
// HELPER FUNCTIONS & CONSTANTS OUTSIDE THE COMPONENT
// ============================================================

const getContrastColor = (hexcolor: string): string => {
  try {
    const hex = hexcolor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
};

const safeString = (value: unknown, fallback: string = '—'): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

interface CleanPortalData {
  client: string;
  logoUrl: string | null;
  brandColor: string;
  healthScore: number;
  servicesCount: number;
  healthFlag: string;
  operationMode: string;
  connectivityType: string;
  internetSpeed: string;
  lastEvalDate: string;
  quarterlyAssessment: any | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

// ============================================================
// COMPONENTE CONTENIDO DEL PORTAL (PortalContent)
// ============================================================

const PortalContent = () => {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const [data, setData] = useState<CleanPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef para rastrear la suscripción activa actual
  const activeSubscriptionRef = useRef<string | null>(null);

  // 1. Efecto para manejar la suscripción de Firebase
  useEffect(() => {
    if (!clientSlug) return;

    // Evitamos suscribirnos si ya tenemos una suscripción activa para este slug
    if (activeSubscriptionRef.current === clientSlug) {
      return;
    }
    activeSubscriptionRef.current = clientSlug;
    setLoading(true);

    const unsubscribe = portalService.subscribeToPortal(clientSlug, (portalData) => {
      if (portalData) {
        // --- Cálculo y sanitización dentro de la suscripción ---
        const brandColor = portalData.brandColor || '#ffffff';
        
        let healthScore = 0;
        try {
          if (portalData.quarterlyAssessment && typeof portalData.quarterlyAssessment === 'object') {
            healthScore = Object.values(portalData.quarterlyAssessment).reduce(
              (acc: number, val: unknown) => acc + (typeof val === 'number' ? val : 0), 0
            );
          }
        } catch (e) {
          healthScore = 0;
        }

        const servicesCount = Array.isArray(portalData.services) ? portalData.services.length : 0;
        const healthFlag = safeString(portalData.healthFlag, 'N/A');
        const operationMode = safeString(portalData.opsPulse?.techDNA?.operationMode, 'Cloud Híbrida');
        const connectivityType = safeString(portalData.opsPulse?.techDNA?.connectivityType, 'Fibra Óptica');
        const internetSpeed = safeString(portalData.opsPulse?.techDNA?.internetSpeed, '1000');
        
        let lastEvalDate = 'Ciclo Actual';
        try {
          if (Array.isArray(portalData.evaluations) && portalData.evaluations.length > 0) {
            lastEvalDate = safeString(portalData.evaluations[portalData.evaluations.length - 1]?.date, 'Ciclo Actual');
          }
        } catch (e) {}

        const nextData: CleanPortalData = {
          client: safeString(portalData.client, 'Portal'),
          logoUrl: portalData.logoUrl,
          brandColor,
          healthScore,
          servicesCount,
          healthFlag,
          operationMode,
          connectivityType,
          internetSpeed,
          lastEvalDate,
          quarterlyAssessment: portalData.quarterlyAssessment
        };

        // --- Comparación profunda limpia y pura ---
        setData((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(nextData)) {
            return nextData;
          }
          return prev;
        });

        setError(null);
      } else {
        setError('Cliente no encontrado');
      }
      setLoading(false);
    });

    return () => {
      activeSubscriptionRef.current = null;
      unsubscribe();
    };
  }, [clientSlug]);

  // 2. Efecto para aplicar de forma segura las variables CSS de Branding en el DOM
  useEffect(() => {
    if (!data?.brandColor) return;
    
    const brand = data.brandColor;
    document.documentElement.style.setProperty('--brand-primary', brand);
    document.documentElement.style.setProperty('--brand-contrast', getContrastColor(brand));

    return () => {
      document.documentElement.style.removeProperty('--brand-primary');
      document.documentElement.style.removeProperty('--brand-contrast');
    };
  }, [data?.brandColor]);

  if (loading) {
    return <PortalLoading clientName={clientSlug} logoUrl={null} />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-thin text-white/50 tracking-wider mb-4">404</h1>
          <p className="text-white/30 font-light">{error || 'Portal no disponible'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-20 max-w-[1600px] mx-auto text-white overflow-x-hidden">
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div 
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-20"
          style={{ background: `var(--brand-primary)` }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
          style={{ background: `var(--brand-primary)` }}
        />
      </div>

      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-24 flex items-center gap-8"
      >
        {data.logoUrl && (
          <img src={data.logoUrl} alt="Logo" className="h-24 object-contain drop-shadow-2xl" />
        )}
        {!data.logoUrl && (
           <h1 className="text-5xl md:text-6xl font-thin tracking-tight">{data.client}</h1>
        )}
      </motion.header>

      {/* Asymmetric Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        style={{ gridAutoRows: '250px' }}
      >
        {/* Item 1: Health Score — 2x2 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-12 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold z-10">Health Score Global</h3>
          <div className="z-10 flex flex-col justify-end h-full mt-10">
             <div className="text-9xl md:text-[12rem] font-thin text-[var(--brand-primary)] leading-none tracking-tighter drop-shadow-2xl">
               {data.healthScore}<span className="text-6xl opacity-30">%</span>
             </div>
          </div>
        </motion.div>

        {/* Item 2: Trend Chart — 2x1 (MODO EMERGENCIA: Desactivado temporalmente) */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-1 relative rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-8 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Tendencia Operativa</h3>
          <div className="flex-1 w-full flex items-center justify-center border border-white/5 rounded-3xl bg-black/10 mt-2">
            <span className="text-white/30 text-xs uppercase tracking-widest">
              Visualización en calibración
            </span>
          </div>
        </motion.div>

        {/* Item 3: Servicios — 1x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Servicios</h3>
          <div className="text-8xl font-thin text-white drop-shadow-lg tracking-tighter">
            {data.servicesCount}
          </div>
        </motion.div>

        {/* Item 4: Health Flag — 1x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Health Flag</h3>
          <div className="text-4xl font-light text-white uppercase tracking-widest" style={{ color: data.brandColor }}>
            {data.healthFlag}
          </div>
        </motion.div>

        {/* Item 5: ADN Tecnológico — 2x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Infraestructura Core</h3>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl font-light text-white uppercase tracking-widest border-l-4 pl-4" style={{ borderColor: 'var(--brand-primary)' }}>
               {data.operationMode}
            </div>
            <div className="text-sm font-light text-white/50 tracking-widest ml-5">
               {data.connectivityType} | {data.internetSpeed} Mbps
            </div>
          </div>
        </motion.div>

        {/* Item 6: Evaluaciones — 2x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Última Revisión</h3>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-4xl font-light text-white uppercase tracking-tight">
               {data.lastEvalDate}
            </div>
            <div className="text-sm font-light text-white/50 tracking-widest">
               Sincronización Inteligente Activa
            </div>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export default function PortalWithErrorBoundary() {
  return (
    <PortalErrorBoundary>
      <PortalContent />
    </PortalErrorBoundary>
  );
}
