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
  botmakerType?: 'Agentes Humanos + Chatbots' | 'Agentes Humanos + Chatbots + Agente IA' | 'Chatbots + Agente IA';
  extensionCount?: number;
  otherDetails?: string;
  positionsCount?: number;
  workSchedule?: string;
  attentionType?: string;
  webServiceType?: 'Onepage' | 'A medida';
  trainingType?: 'Disney' | 'Calidad de Servicio' | 'A medidas';
  
  // Legado
  setupDate?: string;
  botType?: 'IA Generativa' | 'Flujos' | 'Híbrido';
  purpose?: 'Generar Leads' | 'Resolver dudas' | 'Autogestión';
  lastUpdate?: string;
  trunkId?: string;
  lastAdminAccess?: string;
  mgmtType?: 'Ventas' | 'Servicio';
  logs?: ServiceLog[];
  responsible?: string;
  collaborator?: string;
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
  name: string;
  timeRange: string;
  peopleCount: number;
}

export interface OperationPulse {
  hcContracted: number;
  hcReal: number;
  backupStatus: 'Disponible' | 'En Uso' | 'Crítico';
  operationType: string;
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
  satisfactionLevel: number;
  maturityIndex: 'Nivel 1: Inicial' | 'Nivel 2: Gestionado' | 'Nivel 3: Definido' | 'Nivel 4: Medido' | 'Nivel 5: Optimizado';
  growthPotential: string;
  // Legado
  projectLeader?: boolean;
  timelyDocumentation?: boolean;
  advisoryReceptivity?: boolean;
  effectiveServiceUse?: boolean;
  serviceContinuity?: boolean;
  reportValuation?: boolean;
  paymentPunctuality?: boolean;
  status: 'Verde' | 'Amarilla' | 'Roja' | 'Negra';
}

export interface HardwareAsset {
  id: string;
  category?: string;
  model: string;
  assignedPosition?: string;
  status: 'Operativo' | 'Mantenimiento' | 'Fuera de Servicio';
  quantity?: number;
  purchaseDate?: string;
  notes?: string;
}

export interface RecurringTask {
  id: string;
  task: string;
  frequency: 'Diario' | 'Semanal' | 'Mensual' | 'Trimestral';
}

export interface StrategySLA {
  slaRequirements: string;
  nextReviewDate: string;
  recurringTasks: RecurringTask[];
  // Legado
  defaultTaskWeight?: number;
  responseSla?: number;
}

export interface QuarterlyAssessment {
  sla: number;
  comunicacion: number;
  resolucion: number;
  experiencia: number;
  continuidad: number;
  orden: number;
  conversion: number;
  adaptacion: number;
  cultura: number;
  valor: number;
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
