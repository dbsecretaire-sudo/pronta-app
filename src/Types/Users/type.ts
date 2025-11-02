export type Role = 'ADMIN' | 'CLIENT' | 'SECRETARY' | 'SUPERVISOR';

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: number;
  country?: string;
}

export interface PaymentMethodDetails {
  card_last_four?: string;
  card_brand?: string;
  paypal_email?: string;
}

export interface PaymentMethod {
  type?: string;
  details?: PaymentMethodDetails;
  is_default?: boolean;
}

export interface SubscriptionFields {
    plan?: string;
    start_date?: Date | string;
    end_date?: Date | string;
    next_payment_date?: Date | string;
    status: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  created_at?: Date;
  billing_address?: BillingAddress;
  payment_method?: PaymentMethod;
  subscription: SubscriptionFields;
  phone?: string,
  company?: string,
  role: Role;
  // messages?: Message[]; // Si vous avez besoin des messages
}

export type CreateUser = Omit<User, "id" | "created_at" | "password_hash"> & {
  password: string;
};

export type UpdateUser = Partial<Omit<User, "id" | "created_at" | "password_hash">> & {
  password?: string;
};

// export interface UpdateUserSubscription {
//   subscription_plan?: string;
//   subscription_end_date?: Date;
//   next_payment_date?: Date;
//   subscription_status?: 'active' | 'inactive' | 'pending' | 'cancelled' | 'overdue';
// }

export interface UserFilter {
  role?: Role;
  searchTerm?: string;
  subscriptionPlan?: string;
  subscriptionActive?: boolean;
}
