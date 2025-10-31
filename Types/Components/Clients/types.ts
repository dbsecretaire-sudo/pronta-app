export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface ClientCardProps {
  client: Client;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface ClientFormProps {
  client?: ClientFormData;
  onSubmit: (data: ClientFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface ClientListProps {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}