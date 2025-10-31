import { Router } from "express";
import { deleteInvoiceItem } from "../../controller";

const router = Router({ mergeParams: true });

// DELETE /api/invoices/:invoiceId/items/:id
router.delete("/:id", deleteInvoiceItem);

export default router;
