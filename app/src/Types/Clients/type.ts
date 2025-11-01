export interface Client {
  id: number;
  user_id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateClient = Omit<Client, "id" | "created_at" | "updated_at">;

export interface ClientFilter {
  userId?: number;
  searchTerm?: string;
}

// ======================
// FORMULAIRES
export type ClientFormData = Omit<Client, "id" | "user_id" | "created_at" | "updated_at">

export interface ClientFormProps {
  client?: ClientFormData;
  onSubmit: (data: ClientFormData) => Promise<void>;
  isLoading?: boolean;
}

// ======================
// COMPOSANTS
export interface ClientCardProps {
  client: Client;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export interface ClientListProps {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onDelete: (clientId: number) => void; 
}
