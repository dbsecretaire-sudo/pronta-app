import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon?: string | ReactNode;
}

export interface ServiceItem {
  name: string;
  path: string;
  icon: string | ReactNode;
}

export interface NavbarProps {
  children: ReactNode;
  navItems: NavItem[];
  showLogo?: boolean;
  logoText?: string;
  isInService?: boolean;
  services?: ServiceItem[];
  showServicesSection?: boolean;
}