import { Client } from "@/app/models/Client";

export interface ClientCardProps {
  client: Client;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}