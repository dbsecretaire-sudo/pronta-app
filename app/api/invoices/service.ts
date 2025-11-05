import { InvoiceModel, Invoice, InvoiceItem, CreateInvoice, CreateInvoiceItem, InvoiceFilter, UpdateInvoiceStatus } from "./types";
import { validateInvoice, validateInvoiceItem, isValidInvoiceStatus } from "./utils";

export class InvoiceService {
  private invoiceModel: InvoiceModel;

  constructor() {
    this.invoiceModel = new InvoiceModel({} as Invoice)
  }

  async getInvoicesByUserId(userId: number): Promise<Invoice[]> {
    return this.invoiceModel.getInvoicesByUserId(userId);
  }

  async getInvoiceById(id: number): Promise<{ invoice: Invoice; items: InvoiceItem[] } | null> {
    return this.invoiceModel.getInvoiceById(id);
  }

  async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
    return this.invoiceModel.getInvoicesByClient(clientId);
  }

  async filterInvoices(filters: InvoiceFilter): Promise<Invoice[]> {
    return this.invoiceModel.filterInvoices(filters);
  }

  async createInvoice(invoice: CreateInvoice): Promise<Invoice> {
    if (!validateInvoice(invoice)) {
      throw new Error("Invalid invoice data");
    }
    return this.invoiceModel.createInvoice(invoice);
  }

  async addInvoiceItem(item: CreateInvoiceItem): Promise<InvoiceItem> {
    if (!validateInvoiceItem(item)) {
      throw new Error("Invalid invoice item data");
    }
    return this.invoiceModel.addInvoiceItem(item);
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice> {
    return this.invoiceModel.updateInvoice(id, invoice);
  }

  async updateInvoiceStatus(id: number, statusData: UpdateInvoiceStatus): Promise<Invoice> {
    if (!isValidInvoiceStatus(statusData.status)) {
      throw new Error("Invalid invoice status");
    }
    return this.invoiceModel.updateInvoiceStatus(id, statusData.status);
  }

  async deleteInvoice(id: number): Promise<void> {
    await this.invoiceModel.deleteInvoice(id);
  }

  async deleteInvoiceItem(id: number): Promise<void> {
    await this.invoiceModel.deleteInvoiceItem(id);
  }
}
