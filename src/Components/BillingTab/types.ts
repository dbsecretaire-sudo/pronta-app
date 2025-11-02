import { BillingAddress, PaymentMethod } from "@/src/Types/Users";

export type BillingTabProps = {
  data: {
    subscription_plan?: string;
    subscription_end_date?: Date;
    subscription_start_date?: Date;
    next_payment_date?: Date;
    subscription_status?: string;
    service_name?: string;
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  };
  onEdit: (data: {
    subscription_plan?: string;
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  }) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
};
