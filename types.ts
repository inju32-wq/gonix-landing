import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Stat {
  label: string;
  value: string;
  description: string;
}

export interface CoalGrade {
  name: string;
  gcv: number; // Gross Calorific Value
  sulfur: number;
  ash: number;
}