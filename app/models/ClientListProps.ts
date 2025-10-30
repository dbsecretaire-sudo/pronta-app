import { Client } from "@/app/models/Client";

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