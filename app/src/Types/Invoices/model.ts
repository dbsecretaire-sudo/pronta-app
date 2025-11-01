import pool from '@/app/src/lib/db';
import { InvoiceFilter, InvoiceStatus, Invoice, InvoiceItem, CreateInvoice, CreateInvoiceItem } from "./type";

export class InvoiceModel {
    constructor(public data:Invoice) {}

    // Récupérer toutes les factures d'un utilisateur
    async getInvoicesByUserId(userId: number): Promise<Invoice[]> {
      const res = await pool.query(
        'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    }
    
    // Récupérer une facture par son ID (avec ses lignes)
    async getInvoiceById(id: number): Promise<{
      invoice: Invoice;
      items: InvoiceItem[];
    } | null> {
      const invoiceRes = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
      if (invoiceRes.rows.length === 0) return null;
    
      const itemsRes = await pool.query(
        'SELECT * FROM invoice_items WHERE invoice_id = $1',
        [id]
      );
    
      return {
        invoice: invoiceRes.rows[0],
        items: itemsRes.rows,
      };
    }

    async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
      const res = await pool.query(
        "SELECT * FROM invoices WHERE client_id = $1 ORDER BY created_at DESC",
        [clientId]
      );
      return res.rows;
    }

    async filterInvoices(filters: InvoiceFilter): Promise<Invoice[]> {
      let query = "SELECT * FROM invoices WHERE 1=1";
      const params: any[] = [];
      let paramIndex = 1;

      if (filters.userId) {
        query += ` AND user_id = $${paramIndex}`;
        params.push(filters.userId);
        paramIndex++;
      }

      if (filters.clientId) {
        query += ` AND client_id = $${paramIndex}`;
        params.push(filters.clientId);
        paramIndex++;
      }

      if (filters.clientName) {
        query += ` AND client_name ILIKE $${paramIndex}`;
        params.push(`%${filters.clientName}%`);
        paramIndex++;
      }

      if (filters.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters.startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        params.push(filters.startDate);
        paramIndex++;
      }

      if (filters.endDate) {
        query += ` AND created_at <= $${paramIndex}`;
        params.push(filters.endDate);
        paramIndex++;
      }

      query += " ORDER BY created_at DESC";

      const res = await pool.query(query, params);
      return res.rows;
    }
    
    // Créer une facture
    async createInvoice(invoice: CreateInvoice): Promise<Invoice> {
      const res = await pool.query(
        `INSERT INTO invoices (user_id, client_id, client_name, amount, status, due_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          invoice.user_id,
          invoice.client_id,
          invoice.client_name,
          invoice.amount,
          invoice.status || 'draft',
          invoice.due_date,
        ]
      );
      return res.rows[0];
    }
    
    async addInvoiceItem(item: CreateInvoiceItem): Promise<InvoiceItem> {
      const res = await pool.query(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [item.invoice_id, item.description, item.quantity, item.unit_price, item.total_price]
      );
      return res.rows[0];
    }

    // Mettre à jour une facture
    async updateInvoice(
      id: number,
      invoice: Partial<Invoice>
    ): Promise<Invoice> {
      const fields = [];
      const values = [];
      let paramIndex = 1;
    
      if (invoice.client_id !== undefined) {
        fields.push(`client_id = $${paramIndex}`);
        values.push(invoice.client_id);
        paramIndex++;
      }
      if (invoice.client_name !== undefined) {
        fields.push(`client_name = $${paramIndex}`);
        values.push(invoice.client_name);
        paramIndex++;
      }
      if (invoice.amount !== undefined) {
        fields.push(`amount = $${paramIndex}`);
        values.push(invoice.amount);
        paramIndex++;
      }
      if (invoice.status !== undefined) {
        fields.push(`status = $${paramIndex}`);
        values.push(invoice.status);
        paramIndex++;
      }
      if (invoice.due_date !== undefined) {
        fields.push(`due_date = $${paramIndex}`);
        values.push(invoice.due_date);
        paramIndex++;
      }
    
      const res = await pool.query(
        `UPDATE invoices SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
        [...values, id]
      );
      return res.rows[0];
    }
    
    // Supprimer une facture
    async deleteInvoice(id: number): Promise<void> {
      await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
    }
    
    // Créer une ligne de facture
    async createInvoiceItem(item: CreateInvoiceItem): Promise<InvoiceItem> {
      const res = await pool.query(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [item.invoice_id, item.description, item.quantity, item.unit_price]
      );
      return res.rows[0];
    }
    
    // Récupérer les lignes d'une facture
    async getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
      const res = await pool.query(
        'SELECT * FROM invoice_items WHERE invoice_id = $1',
        [invoiceId]
      );
      return res.rows;
    }
    
    // Mettre à jour le statut d'une facture
    async updateInvoiceStatus(
      id: number,
      status: InvoiceStatus
    ): Promise<Invoice> {
      const res = await pool.query(
        'UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      );
      return res.rows[0];
    }

    // Mettre à jour une ligne de facture
    async updateInvoiceItem(id: number, item: Partial<InvoiceItem>): Promise<InvoiceItem> {
        const entries = Object.entries(item).filter(([_, value]) => value !== undefined);
        if (entries.length === 0) {
            const res = await pool.query('SELECT * FROM invoice_items WHERE id = $1', [id]);
            return res.rows[0];
        }
        const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
        const values = entries.map(([_, value]) => value);
        const res = await pool.query(
            `UPDATE invoice_items SET ${fields} WHERE id = $${entries.length + 1} RETURNING *`,
            [...values, id]
        );
        return res.rows[0];
    }

    // Supprimer une ligne de facture
    async deleteInvoiceItem(id: number): Promise<void> {
        await pool.query('DELETE FROM invoice_items WHERE id = $1', [id]);
    }


}

