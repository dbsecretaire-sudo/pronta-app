import { Router } from "express";
import {
  getInvoicesByUserId,
  getInvoiceById,
  getInvoicesByClient,
  filterInvoices,
  createInvoice,
  addInvoiceItem,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  deleteInvoiceItem,
} from "./controller";
import itemRouter from "./[id]/items/route";

const router = Router();

// Routes pour /api/invoices
router.get("/", getInvoicesByUserId);
router.get("/client", getInvoicesByClient);
router.get("/filter", filterInvoices);
router.post("/", createInvoice);
router.post("/:invoiceId/items", addInvoiceItem);

// Routes dynamiques
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);
router.patch("/:id/status", updateInvoiceStatus);
router.delete("/:id", deleteInvoice);

// Routes pour les items de facture
router.use("/:invoiceId/items", itemRouter);

export default router;
