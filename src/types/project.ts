import { Task } from '../components/TaskManager';

export type SipTrunkVirtual = 'Navegalo' | 'Vocex' | 'ICE' | 'Call My Way' | 'Callcentric' | 'Voip.ms' | 'Movistar Vzla.' | 'N/A.';
export type Country = 'Venezuela' | 'Costa Rica';


export interface ServiceLog {
  id: string;
  date: string;
  user: string;
  action: string;
  observation: string;
}

export interface ClientService {
  id: string;
  name: string;
  description: string;
  startDate: string;
  score: number;
  
  // Categoría Técnica Principal
  type?: 'Botmaker' | 'Yeastar' | 'IPBX' | 'Contact Center' | 'Servicios Web' | 'Capacitaciones' | 'Other';

  // Sub-configuraciones según categoría
  // Botmaker
  botmakerType?: 'Plataforma' | 'Plataforma+Bots(Intenciones)' | 'Plataforma+ Agente IA' | 'Plataforma+ Bots+Agente IA';
  
  // Yeastar & IPBX
  extensionCount?: number;
  setupDate?: string;

  // Servicios WEB
  webServiceType?: 'Onepage' | 'Pagina a la medida';

  // Capacitaciones
  trainingType?: 'Free' | 'Costo';

  // Legado / Otros (Keep for compatibility)
  botType?: 'IA Generativa' | 'Flujos' | 'Híbrido';
  purpose?: 'Generar Leads' | 'Resolver dudas' | 'Autogestión';
  lastUpdate?: string;
  trunkId?: string;
  lastAdminAccess?: string;
  mgmtType?: 'Ventas' | 'Servicio';

  // Bitácora
  logs?: ServiceLog[];
  responsible?: string;
  collaborator?: string;
  positionsCount?: number;
  shiftMatrix?: string;
}

export interface Evaluation {
  date?: string;
  month: number;
  year: number;
  quantitative: number;
  qualitative: string;
  status: 'Stable' | 'At Risk' | 'Critical' | 'Growth';
}

export interface Alert {
  id: string;
  date: string;
  type: 'Technical' | 'Operational' | 'Strategic';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  status: 'Open' | 'Resolved';
}

export interface Shift {
  id: string;
  name: string; // e.g. "Turno A"
  timeRange: string; // e.g. "08:00 - 17:00"
  peopleCount: number;
}

export interface OperationPulse {
  hcContracted: number;
  hcReal: number;
  backupStatus: 'Disponible' | 'En Uso' | 'Crítico';
  operationType: 'Servicio al Cliente' | 'Ventas' | 'Cobranza' | 'Soporte Técnico';
  shifts?: Shift[];
}

export interface TechDNA {
  operationMode: 'RC506' | 'WYP' | 'IPBX' | 'HÍBRIDO';
  isp?: string;
  internetSpeed?: string;
  connectivityType?: 'Fibra Óptica' | 'Radiofrecuencia' | 'Cobre';
  redundancy?: boolean;
  phoneLine: string;
  sipTrunkVirtual?: SipTrunkVirtual;
  country?: Country;
}

export interface ClientEvaluation {
  projectLeader: boolean;
  timelyDocumentation: boolean;
  advisoryReceptivity: boolean;
  effectiveServiceUse: boolean;
  serviceContinuity: boolean;
  reportValuation: boolean;
  paymentPunctuality: boolean;
  status: 'Verde' | 'Amarilla' | 'Roja' | 'Negra';
}

export interface HardwareAsset {
  id: string;
  category?: string; // Ej: Hardware, Sistema, Conectividad
  model: string;
  quantity: number;
  purchaseDate: string;
  assignedPosition?: string;
  notes?: string; // Para opciones libres como VPN, detalles de sistema, etc.
}

export interface StrategySLA {
  recurringTasks: string[];
  defaultTaskWeight: number; // 1-10
  responseSla: number; // Horas/Días
}

export interface QuarterlyAssessment {
  responseTime: number;
  communicationQuality: number;
  effectiveResolution: number;
  proactivity: number;
  technicalKnowledge: number;
  reliability: number;
  flexibility: number;
  innovation: number;
  serviceCulture: number;
  valuePerception: number;
}

export interface Project {
  id: string;
  client: string;
  logoUrl?: string;
  startDate: string;
  accountManager?: string;
  partnerLiaison?: {
    name: string;
    email: string;
  };
  strategicObjective?: string;
  services: ClientService[];
  adminStatus: 'En Proceso' | 'Prueba' | 'Activo' | 'Inactivo' | 'Archivado';
  evaluations: Evaluation[];
  alerts?: Alert[];
  healthFlag: 'Verde' | 'Amarilla' | 'Roja' | 'Negra';
  opsPulse?: OperationPulse;
  techDNA?: TechDNA;
  assets?: HardwareAsset[];
  strategy?: StrategySLA;
  clientEvaluation?: ClientEvaluation;
  quarterlyAssessment?: QuarterlyAssessment;
}
