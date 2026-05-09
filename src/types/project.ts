import { Task } from '../components/TaskManager';

export interface ClientService {
  id: string;
  name: string;
  description: string;
  startDate: string;
  score: number;
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

export interface OperationPulse {
  hcContracted: number;
  hcReal: number;
  backupStatus: 'Disponible' | 'En Uso' | 'Crítico';
  shifts?: {
    slot: string; // e.g. "06:00 - 14:00"
    count: number;
  }[];
}

export interface TechDNA {
  operationMode: 'REMOTE' | 'WIP' | 'HÍBRIDO';
  isp: string;
  phoneLine: string;
}

export interface HardwareAsset {
  id: string;
  model: string;
  quantity: number;
  purchaseDate: string;
}

export interface Project {
  id: string;
  client: string;
  logoUrl?: string;
  startDate: string; // Onboarding Date
  services: ClientService[];
  evaluations: Evaluation[];
  alerts?: Alert[];
  // V3.5 Core Data
  healthFlag: 'Verde' | 'Amarilla' | 'Roja' | 'Negra';
  opsPulse?: OperationPulse;
  techDNA?: TechDNA;
  assets?: HardwareAsset[];
}
