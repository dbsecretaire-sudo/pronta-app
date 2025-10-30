import { ClientFormData } from "@/app/models/ClientFormData";

export interface ClientFormProps {
  client?: ClientFormData;
  onSubmit: (data: ClientFormData) => Promise<void>;
  isLoading?: boolean;
}