import { Service } from "../Services";

export interface Subscription {
  id: number;
  user_id?: number;
  service_id: number;
  status: "active" | "cancelled" | "expired" | "paid" | "overdue" | "pending";
  start_date: Date;
  end_date?: Date;
  next_payment_date?: Date | string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UpdateSubscription {
  service_id: number;
  status?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  next_payment_date?: Date | string | null;
}

export interface CreateSubscription {
  user_id: number;
  service_id: number;
  status?: string;
  start_date: Date | string;
  end_date?: Date | string;
  next_payment_date?: Date | string | null;
}

export interface SubscriptionWithService extends Subscription {
  service: Service; // ⬅️ Ajoute l'interface Service ici
}