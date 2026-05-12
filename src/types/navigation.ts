/**
 * Fuente única de verdad para los tipos de navegación del Dashboard.
 * Importar este tipo en Sidebar.tsx, MainLayout.tsx y Dashboard.tsx
 * para garantizar consistencia absoluta entre componentes.
 */

export type TabType =
  | 'overview'
  | 'morning'
  | 'audits'
  | 'reports-ia'
  | 'operations'
  | 'ai-copilot'
  | 'settings'
  | 'clients'
  | 'services'
  | 'tasks'
  | 'archive';

export const TAB_TITLES: Record<TabType, string> = {
  overview:     'CRM de Inteligencia',
  morning:      'Mañana Ejecutiva',
  audits:       'Auditorías de Calidad',
  'reports-ia': 'Reportes de Inteligencia Artificial',
  operations:   'Centro de Operaciones',
  'ai-copilot': 'IA Copilot',
  settings:     'Configuración de Sistema',
  clients:      'Gestión de Clientes',
  services:     'Monitor de Servicios',
  tasks:        'Gestión de Tareas',
  archive:      'Bóveda de Archivos',
};
