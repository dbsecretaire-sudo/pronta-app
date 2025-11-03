import { BillingAddress, PaymentMethod } from "@/src/Types/Users";

export type BillingTabProps = {
  data: {
    subscription: {  // Nouveau champ structuré
      plan: string;
      start_date?: string | Date;
      end_date: string | Date;
      next_payment_date: string | Date;
      status: string;
    };
    service_name?: string;
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  };
  onEdit: (data: {
    subscription?: {  // Nouveau champ structuré pour les mises à jour
      plan?: string;
      start_date?: Date;
      end_date?: Date;
      next_payment_date?: Date;
      status?: string;
    };
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  }) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
};
