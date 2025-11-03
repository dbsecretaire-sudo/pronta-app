export interface Subscription {
  id: number;
  user_id?: number;
  plan: string;
  status: string;
  start_date: Date;
  end_date?: Date;
  next_payment_date?: Date | string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface ApiSubscription {
  id: number;
  user_id?: number;
  plan: string;
  status?: string;  // Peut être undefined depuis l'API
  start_date?: Date;
  end_date?: Date;
  next_payment_date?: Date | string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UpdateSubscription {
  plan?: string;
  status?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  next_payment_date?: Date | string | null;
}

export interface CreateSubscription {
  user_id: number;
  plan: string;
  status?: string;
  start_date: Date | string;
  end_date?: Date | string;
  next_payment_date?: Date | string | null;
}