import { CreateInvoice, InvoiceStatus } from "./types";

export const validateInvoice = (invoice: Partial<CreateInvoice>): boolean => {
  return !!invoice.user_id && !!invoice.client_id && !!invoice.client_name && !!invoice.amount;
};

export const validateInvoiceItem = (item: any): boolean => {
  return !!item.description && item.quantity > 0 && item.unit_price >= 0;
};

export const calculateTotalPrice = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const isValidInvoiceStatus = (status: string): status is InvoiceStatus => {
  return ["draft", "sent", "paid", "overdue"].includes(status);
};
