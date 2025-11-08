// src/lib/schemas/invoice.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma pour un identifiant
export const IdSchema = z.number().int().positive();

// Schéma pour une date (ISO string ou Date object)
export const DateSchema = z.union([
  z.string().datetime(),
  z.date(),
  z.null()
]);

// Schéma pour un statut de facture
export const InvoiceStatusSchema = z.enum([
  'draft',
  'sent',
  'paid',
  'cancelled',
  'overdue'
]);

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma pour un élément de facture
export const InvoiceItemSchema = z.object({
  id: IdSchema,
  invoice_id: IdSchema,
  description: z.string().min(1).max(500),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  total_price: z.number().positive().optional()
});

// Schéma pour la création d'un élément de facture
export const CreateInvoiceItemSchema = z.object({
  invoice_id: IdSchema,
  description: z.string().min(1).max(500),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive()
});

// Schéma pour une facture
export const InvoiceSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  client_id: IdSchema,
  client_name: z.string().min(1).max(255),
  amount: z.number().positive(),
  status: InvoiceStatusSchema,
  due_date: DateSchema,
  created_at: DateSchema,
  updated_at: DateSchema.optional()
});

// Schéma pour la création d'une facture
export const CreateInvoiceSchema = z.object({
  user_id: IdSchema,
  client_id: IdSchema,
  client_name: z.string().min(1).max(255),
  amount: z.number().positive(),
  status: InvoiceStatusSchema.optional().default('draft'),
  due_date: DateSchema
});

// Schéma pour la mise à jour d'une facture
export const UpdateInvoiceSchema = z.object({
  client_id: IdSchema.optional(),
  client_name: z.string().min(1).max(255).optional(),
  amount: z.number().positive().optional(),
  status: InvoiceStatusSchema.optional(),
  due_date: DateSchema.optional()
}).partial();

// Schéma pour une facture avec ses éléments
export const InvoiceWithItemsSchema = InvoiceSchema.extend({
  items: z.array(InvoiceItemSchema)
});

// Schéma pour une facture avec des détails client
export const InvoiceWithClientSchema = InvoiceSchema.extend({
  client: z.object({
    id: IdSchema,
    name: z.string().min(1).max(255),
    email: z.string().email().optional(),
    phone: z.string().optional()
  })
});

// =============================================
// SCHÉMAS POUR LES FILTRES
// =============================================

// Schéma pour les filtres de factures
export const InvoiceFilterSchema = z.object({
  userId: IdSchema.optional(),
  clientId: IdSchema.optional(),
  clientName: z.string().min(1).optional(),
  status: InvoiceStatusSchema.optional(),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional()
});

// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type Invoice = z.infer<typeof InvoiceSchema>;
export type CreateInvoice = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof UpdateInvoiceSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type CreateInvoiceItem = z.infer<typeof CreateInvoiceItemSchema>;
export type InvoiceWithItems = z.infer<typeof InvoiceWithItemsSchema>;
export type InvoiceWithClient = z.infer<typeof InvoiceWithClientSchema>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;
export type InvoiceFilter = z.infer<typeof InvoiceFilterSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'une facture
 */
export const validateCreateInvoice = (data: unknown): CreateInvoice => {
  return CreateInvoiceSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'une facture
 */
export const validateUpdateInvoice = (data: unknown): UpdateInvoice => {
  return UpdateInvoiceSchema.parse(data);
};

/**
 * Valide une facture complète
 */
export const validateInvoice = (data: unknown): Invoice => {
  return InvoiceSchema.parse(data);
};

/**
 * Valide un élément de facture
 */
export const validateInvoiceItem = (data: unknown): InvoiceItem => {
  return InvoiceItemSchema.parse(data);
};

/**
 * Valide les données de création d'un élément de facture
 */
export const validateCreateInvoiceItem = (data: unknown): CreateInvoiceItem => {
  return CreateInvoiceItemSchema.parse(data);
};

/**
 * Valide les filtres de factures
 */
export const validateInvoiceFilter = (data: unknown): InvoiceFilter => {
  return InvoiceFilterSchema.parse(data);
};

// =============================================
// FONCTIONS D'AIDE POUR LES DATES
// =============================================

/**
 * Formate une date pour la base de données
 */
export const formatDateForDB = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : date;
};

/**
 * Parse une date depuis la base de données
 */
export const parseDateFromDB = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  return date instanceof Date ? date : new Date(date);
};

// =============================================
// SCHÉMAS POUR LES REQUÊTES API
// =============================================

// Schéma pour les données de requête de création d'une facture
export const CreateInvoiceRequestSchema = CreateInvoiceSchema;

// Schéma pour les données de requête de mise à jour d'une facture
export const UpdateInvoiceRequestSchema = UpdateInvoiceSchema;

// Schéma pour la réponse API d'une facture
export const InvoiceResponseSchema = InvoiceSchema;

// Schéma pour la réponse API d'une facture avec ses éléments
export const InvoiceWithItemsResponseSchema = InvoiceWithItemsSchema;

// Schéma pour la réponse API d'une facture avec client
export const InvoiceWithClientResponseSchema = InvoiceWithClientSchema;

// =============================================
// SCHÉMAS POUR LES FORMULAIRES
// =============================================

// Schéma pour un formulaire de création de facture
export const InvoiceFormSchema = CreateInvoiceSchema.extend({
  due_date: z.union([
    z.string().datetime(),
    z.date()
  ]).refine(
    (val) => {
      const date = val instanceof Date ? val : new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Date d'échéance invalide" }
  )
});

// Schéma pour un formulaire de mise à jour de facture
export const UpdateInvoiceFormSchema = UpdateInvoiceSchema.extend({
  due_date: z.union([
    z.string().datetime(),
    z.date()
  ]).refine(
    (val) => {
      if (val === undefined) return true;
      const date = val instanceof Date ? val : new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Date d'échéance invalide" }
  ).optional()
});

// Schéma pour un formulaire d'élément de facture
export const InvoiceItemFormSchema = CreateInvoiceItemSchema
  .extend({
    total_price: z.number().positive()
  })
  .superRefine((data, ctx) => {
    const expectedTotal = data.quantity * data.unit_price;
    if (data.total_price !== expectedTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le prix total doit être égal à la quantité multipliée par le prix unitaire",
        path: ["total_price"],
      });
    }
  });

// Schéma pour un formulaire de filtre de factures
export const InvoiceFilterFormSchema = InvoiceFilterSchema.extend({
  startDate: z.union([
    z.string().datetime(),
    z.date()
  ]).refine(
    (val) => {
      if (val === undefined) return true;
      const date = val instanceof Date ? val : new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Date de début invalide" }
  ).optional(),
  endDate: z.union([
    z.string().datetime(),
    z.date()
  ]).refine(
    (val) => {
      if (val === undefined) return true;
      const date = val instanceof Date ? val : new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Date de fin invalide" }
  ).optional()
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    const start = data.startDate instanceof Date ?
      data.startDate :
      new Date(data.startDate);
    const end = data.endDate instanceof Date ?
      data.endDate :
      new Date(data.endDate);
    return end.getTime() >= start.getTime();
  },
  {
    message: "La date de fin doit être postérieure ou égale à la date de début",
    path: ["endDate"]
  }
);

// =============================================
// FONCTIONS UTILITAIRES POUR LES REQUÊTES SQL
// =============================================

/**
 * Génère une requête SQL pour filtrer les factures
 */
export const generateInvoiceFilterQuery = (filter: InvoiceFilter): { query: string, params: any[] } => {
  let query = "SELECT * FROM invoices WHERE 1=1";
  const params: any[] = [];
  let paramIndex = 1;

  if (filter.userId) {
    query += ` AND user_id = $${paramIndex}`;
    params.push(filter.userId);
    paramIndex++;
  }

  if (filter.clientId) {
    query += ` AND client_id = $${paramIndex}`;
    params.push(filter.clientId);
    paramIndex++;
  }

  if (filter.clientName) {
    query += ` AND client_name ILIKE $${paramIndex}`;
    params.push(`%${filter.clientName}%`);
    paramIndex++;
  }

  if (filter.status) {
    query += ` AND status = $${paramIndex}`;
    params.push(filter.status);
    paramIndex++;
  }

  if (filter.startDate) {
    query += ` AND created_at >= $${paramIndex}`;
    params.push(formatDateForDB(filter.startDate));
    paramIndex++;
  }

  if (filter.endDate) {
    query += ` AND created_at <= $${paramIndex}`;
    params.push(formatDateForDB(filter.endDate));
    paramIndex++;
  }

  query += " ORDER BY created_at DESC";

  return { query, params };
};

/**
 * Génère une requête SQL pour créer une facture
 */
export const generateCreateInvoiceQuery = (invoice: CreateInvoice): { query: string, params: any[] } => {
  const query = `
    INSERT INTO invoices (user_id, client_id, client_name, amount, status, due_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const params = [
    invoice.user_id,
    invoice.client_id,
    invoice.client_name,
    invoice.amount,
    invoice.status || 'draft',
    formatDateForDB(invoice.due_date)
  ];

  return { query, params };
};

/**
 * Génère une requête SQL pour mettre à jour une facture
 */
export const generateUpdateInvoiceQuery = (id: number, invoice: UpdateInvoice): { query: string, params: any[] } => {
  const entries = Object.entries(invoice).filter(([_, value]) => value !== undefined);
  if (entries.length === 0) {
    return {
      query: 'SELECT * FROM invoices WHERE id = $1',
      params: [id]
    };
  }

  const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
  const values = entries.map(([_, value]) => {
    if (value === null) return null;
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  });

  const query = `
    UPDATE invoices
    SET ${fields}, updated_at = NOW()
    WHERE id = $${entries.length + 1}
    RETURNING *
  `;

  return { query, params: [...values, id] };
};

/**
 * Génère une requête SQL pour créer un élément de facture
 */
export const generateCreateInvoiceItemQuery = (item: CreateInvoiceItem): { query: string, params: any[] } => {
  const query = `
    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const totalPrice = item.quantity * item.unit_price;

  const params = [
    item.invoice_id,
    item.description,
    item.quantity,
    item.unit_price,
    totalPrice
  ];

  return { query, params };
};

/**
 * Génère une requête SQL pour mettre à jour un élément de facture
 */
export const generateUpdateInvoiceItemQuery = (id: number, item: Partial<InvoiceItem>): { query: string, params: any[] } => {
  const entries = Object.entries(item).filter(([_, value]) => value !== undefined);
  if (entries.length === 0) {
    return {
      query: 'SELECT * FROM invoice_items WHERE id = $1',
      params: [id]
    };
  }

  const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
  const values = entries.map(([_, value]) => value);

  const query = `
    UPDATE invoice_items
    SET ${fields}
    WHERE id = $${entries.length + 1}
    RETURNING *
  `;

  return { query, params: [...values, id] };
};

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleInvoice: Invoice = {
  id: 1,
  user_id: 1,
  client_id: 5,
  client_name: "Entreprise XYZ",
  amount: 199.99,
  status: "paid",
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const exampleCreateInvoice: CreateInvoice = {
  user_id: 1,
  client_id: 5,
  client_name: "Entreprise XYZ",
  amount: 199.99,
  status: "draft",
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 jours
};

export const exampleInvoiceItem: InvoiceItem = {
  id: 1,
  invoice_id: 1,
  description: "Service de consultation - 10 heures",
  quantity: 10,
  unit_price: 19.99,
  total_price: 199.90
};

export const exampleCreateInvoiceItem: CreateInvoiceItem = {
  invoice_id: 1,
  description: "Nouveau service de consultation",
  quantity: 5,
  unit_price: 29.99
};

export const exampleInvoiceWithItems: InvoiceWithItems = {
  ...exampleInvoice,
  items: [
    {
      id: 1,
      invoice_id: 1,
      description: "Service de consultation - 10 heures",
      quantity: 10,
      unit_price: 19.99,
      total_price: 199.90
    },
    {
      id: 2,
      invoice_id: 1,
      description: "Frais de déplacement",
      quantity: 1,
      unit_price: 50.00,
      total_price: 50.00
    }
  ]
};

export const exampleInvoiceWithClient: InvoiceWithClient = {
  ...exampleInvoice,
  client: {
    id: 5,
    name: "Entreprise XYZ",
    email: "contact@entreprise-xyz.com",
    phone: "+33123456789"
  }
};

export const exampleInvoiceFilter: InvoiceFilter = {
  userId: 1,
  clientId: 5,
  clientName: "Entreprise",
  status: "paid",
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // -30 jours
  endDate: new Date()
};
