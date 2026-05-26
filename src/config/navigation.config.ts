import { LayoutGrid, Users, ShieldCheck, Archive } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Expedientes' },
  { to: '/trimestre', icon: ShieldCheck, label: 'Trimestre' },
  { to: '/archive', icon: Archive, label: 'Bóveda' },
];
