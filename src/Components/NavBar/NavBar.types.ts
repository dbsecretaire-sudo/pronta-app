// src/Components/NavBar.types.ts
export interface ServiceItem {
  name: string;
  path: string;
  icon: string | React.ReactNode;
}

export interface NavbarProps {
  children?: React.ReactNode;
  showLogo?: boolean;
  logoText?: string;
  isInService?: boolean;
  userServices?: ServiceItem[];
  onRefreshServices?: () => void; 
}
