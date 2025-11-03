import { BillingAddress, PaymentMethod } from "@/src/Types/Users";

export type BillingTabProps = {
  data: {
    id: number;
    email: string;
    subscriptions: Array<{
      id: number;
      plan: string;
      status?: string;
      start_date?: Date;
      end_date?: Date;
      next_payment_date?: Date | string | null;
      created_at?: Date;
    }>;
    service_name?: string;
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  };
  onEdit: (payload: any) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
};


export interface BillingTabData {
  id: number;
  email: string;
  subscriptions: Array<{
    id: number;
    plan: string;
    status: string;
    start_date: string | Date;
    end_date?: string | Date;
    next_payment_date?: string | Date | null;
    created_at?: string | Date;
  }>;
  billing_address?: any;
  payment_method?: any;
}