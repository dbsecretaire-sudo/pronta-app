import { ReactNode } from "react";
import { InputHTMLAttributes } from "react";

export interface PaginationProps {
  currentPage: number;  
  totalPages: number;
  onPageChange: (page: number) => void;
}  

export interface NavbarProps {
  children: React.ReactNode;  
  navItems: Array<{ name: string; path: string; icon?: string | React.ReactNode }>;
  showLogo?: boolean;
  logoText?: string;
  isInService?: boolean;
  services?: Array<{ name: string; path: string; icon: string | React.ReactNode }>;
  showServicesSection?: boolean;
}  

export interface ModalProps {
  isOpen: boolean;  
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}  

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => ReactNode;
  }[];
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
}