import { Service } from "@/src/Types/Services";
import { BillingAddress, PaymentMethod } from "@/src/Types/Users";
import { SubscriptionStatus, SubscriptionWithService } from "@/src/lib/schemas/subscription";

export type BillingTabProps = {
  data: {
    id: number;
    email: string;
    subscriptions: Array<SubscriptionWithService>
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  };
  onEdit: (payload: any) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
};


export interface BillingTabData {
  id: number;
  email: string;
  subscriptions: Array<SubscriptionWithService>
  billing_address?: any;
  payment_method?: any;
}