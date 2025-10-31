import { Request, Response } from "express";
import { InvoiceService } from "./service";
import { calculateTotalPrice } from "./utils";
import { InvoiceStatus } from "./types";

const invoiceService = new InvoiceService();

export const getInvoicesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const invoices = await invoiceService.getInvoicesByUserId(Number(userId));
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(Number(id));
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

export const getInvoicesByClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.query;
    if (!clientId) return res.status(400).json({ error: "clientId is required" });
    const invoices = await invoiceService.getInvoicesByClient(Number(clientId));
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

export const filterInvoices = async (req: Request, res: Response) => {
  try {
    const { userId, clientId, status, startDate, endDate } = req.query;
    const invoices = await invoiceService.filterInvoices({
      userId: userId ? Number(userId) : undefined,
      clientId: clientId ? Number(clientId) : undefined,
      status: status as InvoiceStatus | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Failed to filter invoices" });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = req.body;
    const newInvoice = await invoiceService.createInvoice(invoice);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

export const addInvoiceItem = async (req: Request, res: Response) => {
  try {
    const item = req.body;
    item.total_price = calculateTotalPrice(item.quantity, item.unit_price);
    const newItem = await invoiceService.addInvoiceItem(item);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add invoice item" });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = req.body;
    const updatedInvoice = await invoiceService.updateInvoice(Number(id), invoice);
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to update invoice" });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedInvoice = await invoiceService.updateInvoiceStatus(Number(id), { status });
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to update invoice status" });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await invoiceService.deleteInvoice(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete invoice" });
  }
};

export const deleteInvoiceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await invoiceService.deleteInvoiceItem(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete invoice item" });
  }
};
