export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListProps {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onDelete: (clientId: string) => void;
  loading: boolean;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export const emptyClient: ClientFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  company: ""
};

export interface ClientFormProps {
  client?: ClientFormData;
  onSubmit: (data: ClientFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface ClientCardProps {
  client: Client;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}