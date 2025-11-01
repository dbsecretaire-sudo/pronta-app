// app/api/invoices/controller.ts
import { InvoiceService } from './service';
import { CreateInvoiceItem, UpdateInvoiceStatus, InvoiceStatus, InvoiceFilter } from './types';
import pool from '@/src/lib/db';

const invoiceService = new InvoiceService();

export const getInvoicesByUserId = async (userId: number) => {
  return await invoiceService.getInvoicesByUserId(userId);
};

export const getInvoiceById = async (id: number) => {
  return await invoiceService.getInvoiceById(id);
};

export const getInvoicesByClient = async (clientId: number) => {
  return await invoiceService.getInvoicesByClient(clientId);
};

export const filterInvoices = async (filters: InvoiceFilter) => {
  return await invoiceService.filterInvoices(filters);
};

export const createInvoice = async (invoiceData: any) => {
  return await invoiceService.createInvoice(invoiceData);
};

export const addInvoiceItem = async (invoiceId: number, itemData: Omit<CreateInvoiceItem, 'invoice_id'>) => {
  const item: CreateInvoiceItem = {
    invoice_id: invoiceId, 
    ...itemData 
  };

  return await invoiceService.addInvoiceItem(item);
};

export const updateInvoice = async (id: number, invoiceData: any) => {
  return await invoiceService.updateInvoice(id, invoiceData);
};

export const updateInvoiceStatus = async (id: number, status: InvoiceStatus) => {
    const statusData: UpdateInvoiceStatus = {
      status: status
    };

    return await invoiceService.updateInvoiceStatus(id, statusData);
};

export const deleteInvoice = async (id: number) => {
  return await invoiceService.deleteInvoice(id);
};

export const deleteInvoiceItem = async (invoiceId: number, itemId: number) => {
  // 1. Vérifiez que l'item appartient à la facture
  const checkQuery = 'SELECT 1 FROM invoice_items WHERE id = $1 AND invoice_id = $2';
  const checkRes = await pool.query(checkQuery, [itemId, invoiceId]);

  if (checkRes.rows.length === 0) {
    throw new Error("Item not found or doesn't belong to this invoice");
  }

  // 2. Supprimez l'item
  return await invoiceService.deleteInvoiceItem(itemId);
};
