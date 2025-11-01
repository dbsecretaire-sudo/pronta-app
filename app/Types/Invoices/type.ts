export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: number;
  user_id: number;
  client_id: number;
  client_name: string;
  amount: number;
  status: InvoiceStatus;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type CreateInvoice = Omit<Invoice, "id" | "created_at" | "updated_at">;

export type CreateInvoiceItem = Omit<InvoiceItem, "id" >;

export interface InvoiceFilter {
  userId?: number;
  clientId?: number;
  clientName?: string;
  status?: InvoiceStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateInvoiceStatus {
  status: InvoiceStatus;
}