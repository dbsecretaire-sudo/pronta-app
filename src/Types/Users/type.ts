export type Role = 'ADMIN' | 'CLIENT' | 'SECRETARY' | 'SUPERVISOR';

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface PaymentMethod {
  type?: 'credit_card' | 'paypal' | 'bank_transfer';
  details?: {
    card_last_four?: string;
    card_brand?: string;
    paypal_email?: string;
  };
  is_default?: boolean;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  created_at?: Date;
  billing_address?: BillingAddress;
  payment_method?: PaymentMethod;
  subscription_plan?: string;
  subscription_end_date?: Date;
  phone?: string,
  company?: string,
  next_payment_date?: Date,
  subscription_status?: string;
  role: Role;
}

export type CreateUser = Omit<User, "id" | "created_at" | "password_hash"> & {
  password: string;
};

export type UpdateUser = Partial<Omit<User, "id" | "created_at" | "password_hash">> & {
  password?: string;
};

export interface UserFilter {
  role?: Role;
  searchTerm?: string;
  subscriptionPlan?: string;
  subscriptionActive?: boolean;
}
