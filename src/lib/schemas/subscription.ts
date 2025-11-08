// src/lib/schemas/subscription.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma de base pour une date (ISO string ou Date object)
export const DateSchema = z.union([
  z.string().datetime(),
  z.date(),
  z.null()
]);

// Schéma pour un identifiant
export const IdSchema = z.number().int().positive();

// Schéma pour un statut d'abonnement
export const SubscriptionStatusSchema = z.enum([
  'active',
  'cancelled',
  'paused',
  'expired'
]);

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma pour un service (utilisé dans SubscriptionWithService)
export const ServiceSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().min(1),
  icon: z.string().optional(),
  route: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true)
});

// Schéma de base pour un abonnement
export const SubscriptionSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  service_id: IdSchema,
  status: SubscriptionStatusSchema,
  start_date: DateSchema,
  end_date: DateSchema.nullable(),
  next_payment_date: DateSchema.nullable(),
  created_at: DateSchema,
  updated_at: DateSchema
});

// Schéma pour un abonnement avec son service associé
export const SubscriptionWithServiceSchema = SubscriptionSchema.extend({
  service: ServiceSchema
});

// Schéma pour la création d'un abonnement
export const CreateSubscriptionSchema = z.object({
  user_id: IdSchema,
  service_id: IdSchema,
  status: SubscriptionStatusSchema.optional().default('active'),
  start_date: DateSchema.optional().default(() => new Date()),
  end_date: DateSchema.nullable().optional(),
  next_payment_date: DateSchema.nullable().optional()
});

// Schéma pour la mise à jour d'un abonnement
export const UpdateSubscriptionSchema = z.object({
  service_id: IdSchema.optional(),
  status: SubscriptionStatusSchema.optional(),
  start_date: DateSchema.optional(),
  end_date: DateSchema.nullable().optional(),
  next_payment_date: DateSchema.nullable().optional()
}).partial(); // Tous les champs sont optionnels



// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type SubscriptionWithService = z.infer<typeof SubscriptionWithServiceSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'un abonnement
 */
export const validateCreateSubscription = (data: unknown): CreateSubscription => {
  return CreateSubscriptionSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'un abonnement
 */
export const validateUpdateSubscription = (data: unknown): UpdateSubscription => {
  return UpdateSubscriptionSchema.parse(data);
};

/**
 * Valide un abonnement complet
 */
export const validateSubscription = (data: unknown): Subscription => {
  return SubscriptionSchema.parse(data);
};

// =============================================
// FONCTIONS D'AIDE POUR LES DATES
// =============================================

/**
 * Convertit une date en ISO string pour la base de données
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

// Schéma pour les données de requête de création
export const CreateSubscriptionRequestSchema = CreateSubscriptionSchema.extend({
  user_id: IdSchema,
  service_id: IdSchema
});

// Schéma pour les données de requête de mise à jour
export const UpdateSubscriptionRequestSchema = UpdateSubscriptionSchema;

// Schéma pour la réponse API d'un abonnement
export const SubscriptionResponseSchema = SubscriptionSchema;

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleCreateSubscription: CreateSubscription = {
  user_id: 1,
  service_id: 2,
  status: 'active',
  start_date: new Date()
};

export const exampleSubscription: Subscription = {
  id: 1,
  user_id: 1,
  service_id: 2,
  status: 'active',
  start_date: new Date().toISOString(),
  end_date: null,
  next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

