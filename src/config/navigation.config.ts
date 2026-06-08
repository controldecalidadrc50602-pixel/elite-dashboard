import { LayoutGrid, Users, ShieldCheck, Archive, Layers } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Expedientes' },
  { to: '/services', icon: Layers, label: 'Servicios' },
  { to: '/trimestre', icon: ShieldCheck, label: 'Análisis Mensual' },
  { to: '/archive', icon: Archive, label: 'Bóveda' },
];
