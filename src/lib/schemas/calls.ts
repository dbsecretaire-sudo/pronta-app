// src/lib/schemas/call.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma pour un identifiant
export const IdSchema = z.number().int().positive();

// Schéma pour une date/heure (ISO string ou Date object)
export const DateTimeSchema = z.union([
  z.string().datetime(),
  z.date(),
  z.null()
]);

// Schéma pour les types d'appel
export const CallTypeSchema = z.enum([
  'incoming',
  'outgoing',
  'missed'
]);

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma de base pour un appel
export const CallSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  name: z.string().min(1).max(255).optional(),
  phone: z.string().min(1).max(50).optional(),
  date: DateTimeSchema,
  type: CallTypeSchema,
  summary: z.string().max(1000).optional(),
  duration: z.number().int().positive().optional(),
  phone_number: z.string().min(1).max(50),
  contact_name: z.string().min(1).max(255).optional(),
  client_id: IdSchema.optional(),
  created_at: DateTimeSchema,
  updated_at: DateTimeSchema.optional()
});

// Schéma pour la création d'un appel
export const CreateCallSchema = z.object({
  user_id: IdSchema,
  name: z.string().min(1).max(255).optional(),
  phone: z.string().min(1).max(50).optional(),
  date: DateTimeSchema,
  type: CallTypeSchema,
  summary: z.string().max(1000).optional(),
  duration: z.number().int().positive().optional(),
  phone_number: z.string().min(1).max(50),
  contact_name: z.string().min(1).max(255).optional(),
  client_id: IdSchema.optional()
});

// Schéma pour la mise à jour d'un appel
export const UpdateCallSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  phone: z.string().min(1).max(50).optional(),
  date: DateTimeSchema.optional(),
  type: CallTypeSchema.optional(),
  summary: z.string().max(1000).optional(),
  duration: z.number().int().positive().optional(),
  phone_number: z.string().min(1).max(50).optional(),
  contact_name: z.string().min(1).max(255).optional(),
  client_id: IdSchema.optional()
}).partial();

// Schéma pour un appel avec des détails utilisateur
export const CallWithUserSchema = CallSchema.extend({
  user: z.object({
    id: IdSchema,
    name: z.string().min(1),
    email: z.string().email()
  })
});

// Schéma pour un appel avec des détails client
export const CallWithClientSchema = CallSchema.extend({
  client: z.object({
    id: IdSchema,
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().min(1).max(50).optional()
  }).optional()
});

// =============================================
// SCHÉMAS POUR LES FILTRES
// =============================================

// Schéma pour les filtres d'appels
export const CallFilterSchema = z.object({
  userId: IdSchema,
  byName: z.string().min(1).optional(),
  byPhone: z.string().min(1).optional(),
  startDate: DateTimeSchema.optional(),
  endDate: DateTimeSchema.optional(),
  type: CallTypeSchema.optional()
});

// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type Call = z.infer<typeof CallSchema>;
export type CreateCall = z.infer<typeof CreateCallSchema>;
export type UpdateCall = z.infer<typeof UpdateCallSchema>;
export type CallWithUser = z.infer<typeof CallWithUserSchema>;
export type CallWithClient = z.infer<typeof CallWithClientSchema>;
export type CallType = z.infer<typeof CallTypeSchema>;
export type CallFilter = z.infer<typeof CallFilterSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'un appel
 */
export const validateCreateCall = (data: unknown): CreateCall => {
  return CreateCallSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'un appel
 */
export const validateUpdateCall = (data: unknown): UpdateCall => {
  return UpdateCallSchema.parse(data);
};

/**
 * Valide un appel complet
 */
export const validateCall = (data: unknown): Call => {
  return CallSchema.parse(data);
};

/**
 * Valide les filtres d'appels
 */
export const validateCallFilter = (data: unknown): CallFilter => {
  return CallFilterSchema.parse(data);
};

// =============================================
// FONCTIONS D'AIDE POUR LES DATES
// =============================================

/**
 * Formate une date/heure pour la base de données
 */
export const formatDateTimeForDB = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : date;
};

/**
 * Parse une date/heure depuis la base de données
 */
export const parseDateTimeFromDB = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  return date instanceof Date ? date : new Date(date);
};

// =============================================
// SCHÉMAS POUR LES REQUÊTES API
// =============================================

// Schéma pour les données de requête de création
export const CreateCallRequestSchema = CreateCallSchema;

// Schéma pour les données de requête de mise à jour
export const UpdateCallRequestSchema = UpdateCallSchema;

// Schéma pour la réponse API d'un appel
export const CallResponseSchema = CallSchema;

// Schéma pour la réponse API d'un appel avec utilisateur
export const CallWithUserResponseSchema = CallWithUserSchema;

// Schéma pour la réponse API d'un appel avec client
export const CallWithClientResponseSchema = CallWithClientSchema;

// =============================================
// SCHÉMAS POUR LES FORMULAIRES
// =============================================

// Schéma pour un formulaire de création d'appel
export const CallFormSchema = CreateCallSchema
  .extend({
    date: z.union([
      z.string().datetime(),
      z.date()
    ]).refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date invalide" }
    )
  })
  .refine(
    (data) => {
      if (data.duration && data.duration <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "La durée doit être un nombre positif",
      path: ["duration"]
    }
  );

// Schéma pour un formulaire de mise à jour d'appel
export const UpdateCallFormSchema = UpdateCallSchema
  .extend({
    date: z.union([
      z.string().datetime(),
      z.date()
    ]).refine(
      (val) => {
        if (val === undefined) return true;
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date invalide" }
    ).optional()
  })
  .refine(
    (data) => {
      if (data.duration !== undefined && data.duration <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "La durée doit être un nombre positif",
      path: ["duration"]
    }
  );

// Schéma pour un formulaire de filtre d'appels
export const CallFilterFormSchema = CallFilterSchema
  .extend({
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
  })
  .refine(
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
 * Génère une requête SQL pour filtrer les appels
 */
export const generateCallFilterQuery = (filter: CallFilter): { query: string, params: any[] } => {
  let query = 'SELECT * FROM calls WHERE user_id = $1';
  const params: any[] = [filter.userId];

  if (filter.byName) {
    query += ` AND name ILIKE $${params.length + 1}`;
    params.push(`%${filter.byName}%`);
  }

  if (filter.byPhone) {
    query += ` AND phone ILIKE $${params.length + 1}`;
    params.push(`%${filter.byPhone}%`);
  }

  if (filter.startDate) {
    query += ` AND date >= $${params.length + 1}`;
    params.push(formatDateTimeForDB(filter.startDate));
  }

  if (filter.endDate) {
    query += ` AND date <= $${params.length + 1}`;
    params.push(formatDateTimeForDB(filter.endDate));
  }

  if (filter.type) {
    query += ` AND type = $${params.length + 1}`;
    params.push(filter.type);
  }

  query += ' ORDER BY date DESC';

  return { query, params };
};

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleCall: Call = {
  id: 1,
  user_id: 1,
  name: "Client Important",
  phone: "+33123456789",
  date: new Date().toISOString(),
  type: "incoming",
  summary: "Discussion sur le projet en cours",
  duration: 1800, // 30 minutes
  phone_number: "+33123456789",
  contact_name: "Jean Dupont",
  client_id: 5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const exampleCreateCall: CreateCall = {
  user_id: 1,
  name: "Nouveau Client",
  phone: "+33654321987",
  date: new Date(),
  type: "outgoing",
  summary: "Premier contact avec le client",
  duration: 900, // 15 minutes
  phone_number: "+33654321987",
  contact_name: "Marie Martin",
  client_id: 10
};

export const exampleCallWithUser: CallWithUser = {
  ...exampleCall,
  user: {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@example.com"
  }
};

export const exampleCallWithClient: CallWithClient = {
  ...exampleCall,
  client: {
    id: 5,
    name: "Entreprise XYZ",
    email: "contact@entreprise-xyz.com",
    phone: "+33123456789"
  }
};

export const exampleCallFilter: CallFilter = {
  userId: 1,
  byName: "Client",
  byPhone: "33123",
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // -7 jours
  endDate: new Date(),
  type: "incoming"
};
