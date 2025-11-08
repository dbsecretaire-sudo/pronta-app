export type Role = 'ADMIN' | 'CLIENT' | 'SECRETARY' | 'SUPERVISOR';

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: number;
  country?: string;
}

export interface PaymentMethodDetails {
  card_number?: string;
  card_last_four?: string;
  card_brand?: string;
  paypal_email?: string;
}

export interface PaymentMethod {
  type?: string;
  details?: PaymentMethodDetails;
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
  phone?: string,
  company?: string,
  role: Role;
  can_write: boolean;
  can_delete: boolean;
  service_ids: number[];
  // messages?: Message[]; // Si vous avez besoin des messages
}

export type UpdateUserPermissions = {
  can_write?: boolean;
  can_delete?: boolean;
};

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
