import { Service } from "@/src/lib/schemas";

// src/Components/NavBar.types.ts
export interface ServiceItem {
  name: string;
  route: string;
  icon: string | React.ReactNode;
}

export interface NavbarProps {
  children?: React.ReactNode;
  showLogo?: boolean;
  logoText?: string;
  // isInService?: boolean;
  userServices?: Service[];
  accessToken: string | null;
}
