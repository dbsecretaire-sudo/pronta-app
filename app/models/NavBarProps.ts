export interface NavbarProps {
  children: React.ReactNode;
  navItems: Array<{ name: string; path: string; icon?: string | React.ReactNode }>;
  showLogo?: boolean;
  logoText?: string;
  isInService?: boolean;
  services?: Array<{ name: string; path: string; icon: string | React.ReactNode }>;
  showServicesSection?: boolean;
}