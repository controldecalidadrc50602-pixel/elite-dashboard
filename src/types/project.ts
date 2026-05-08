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

export interface Project {
  id: string;
  client: string;
  logoUrl?: string;
  startDate: string;
  services: ClientService[];
  evaluations: Evaluation[];
  alerts?: Alert[];
  status: 'Óptimo' | 'Aceptable' | 'Mejorable' | 'Deficiente';
}
