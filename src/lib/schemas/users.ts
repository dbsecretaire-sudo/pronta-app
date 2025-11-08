// src/lib/schemas/user.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma pour une date (ISO string ou Date object)
export const DateSchema = z.union([
  z.string().datetime(),
  z.date(),
  z.null()
]);

// Schéma pour un identifiant
export const IdSchema = z.number().int().positive();

// Schéma pour les rôles d'utilisateur
export const RoleSchema = z.enum([
  'ADMIN',
  'SECRETARY',
  'CLIENT',
  'SUPERVISOR',
  'MODERATOR'
]);

// Schéma pour une adresse de facturation
export const BillingAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1)
}).partial();

// Schéma pour une méthode de paiement
export const PaymentMethodSchema = z.object({
  type: z.enum(['credit_card', 'paypal', 'bank_transfer', 'other']),
  details: z.record(z.string(), z.unknown()).optional()
}).partial();

// Schéma pour les détails de carte de crédit
export const CreditCardDetailsSchema = z.object({
  card_last_four: z.string().length(4),
  brand: z.string().min(1),
  expiry_month: z.string().length(2).optional(),
  expiry_year: z.string().length(4).optional()
}).partial();

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma de base pour un utilisateur
export const UserSchema = z.object({
  id: IdSchema,
  email: z.string().email(),
  password_hash: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: RoleSchema,
  can_write: z.boolean().default(false),
  can_delete: z.boolean().default(false),
  created_at: DateSchema,
  updated_at: DateSchema,
  billing_address: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    BillingAddressSchema.optional()
  ),
  payment_method: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.object({
      type: z.enum(['credit_card', 'paypal', 'bank_transfer', 'other']),
      details: z.union([
        CreditCardDetailsSchema,
        z.record(z.string(), z.unknown())
      ]).optional()
    }).optional()
  ),
  service_ids: z.array(IdSchema).optional()
});

// Schéma pour la création d'un utilisateur
export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: RoleSchema.optional().default('CLIENT'),
  can_write: z.boolean().optional().default(false),
  can_delete: z.boolean().optional().default(false),
  billing_address: BillingAddressSchema.optional(),
  payment_method: z.object({
    type: z.enum(['credit_card', 'paypal', 'bank_transfer', 'other']),
    details: z.union([
      CreditCardDetailsSchema,
      z.record(z.string(), z.unknown())
    ]).optional()
  }).optional(),
  service_ids: z.array(IdSchema).optional()
});

// Schéma pour la mise à jour d'un utilisateur
export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: RoleSchema.optional(),
  can_write: z.boolean().optional(),
  can_delete: z.boolean().optional(),
  billing_address: BillingAddressSchema.optional(),
  payment_method: z.object({
    type: z.enum(['credit_card', 'paypal', 'bank_transfer', 'other']),
    details: z.union([
      CreditCardDetailsSchema,
      z.record(z.string(), z.unknown())
    ]).optional()
  }).optional(),
  service_ids: z.array(IdSchema).optional()
}).partial();

// Schéma pour un utilisateur avec ses abonnements
export const UserWithSubscriptionsSchema = UserSchema.extend({
  subscriptions: z.array(
    z.object({
      id: IdSchema,
      user_id: IdSchema,
      service_id: IdSchema,
      status: z.string().min(1),
      start_date: DateSchema,
      end_date: DateSchema.nullable(),
      next_payment_date: DateSchema.nullable(),
      created_at: DateSchema,
      updated_at: DateSchema
    })
  ).optional()
});

// Schéma pour un utilisateur avec ses services
export const UserWithServicesSchema = UserSchema.extend({
  services: z.array(
    z.object({
      id: IdSchema,
      name: z.string().min(1),
      description: z.string().optional(),
      route: z.string().optional(),
      icon: z.string().optional(),
      price: z.number().positive(),
      unit: z.string().min(1),
      is_active: z.boolean().default(true)
    })
  ).optional()
});

// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserWithSubscriptions = z.infer<typeof UserWithSubscriptionsSchema>;
export type UserWithServices = z.infer<typeof UserWithServicesSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type BillingAddress = z.infer<typeof BillingAddressSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type CreditCardDetails = z.infer<typeof CreditCardDetailsSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'un utilisateur
 */
export const validateCreateUser = (data: unknown): CreateUser => {
  return CreateUserSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'un utilisateur
 */
export const validateUpdateUser = (data: unknown): UpdateUser => {
  return UpdateUserSchema.parse(data);
};

/**
 * Valide un utilisateur complet
 */
export const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};

// =============================================
// FONCTIONS D'AIDE POUR LES DONNÉES
// =============================================

/**
 * Formate une adresse de facturation pour la base de données
 */
export const formatBillingAddressForDB = (address: BillingAddress | undefined | null): string | null => {
  if (!address) return null;
  return JSON.stringify(address);
};

/**
 * Parse une adresse de facturation depuis la base de données
 */
export const parseBillingAddressFromDB = (address: string | undefined | null): BillingAddress | null => {
  if (!address) return null;
  try {
    return JSON.parse(address);
  } catch {
    return null;
  }
};

/**
 * Formate une méthode de paiement pour la base de données
 */
export const formatPaymentMethodForDB = (method: PaymentMethod | undefined | null): string | null => {
  if (!method) return null;
  return JSON.stringify(method);
};

/**
 * Parse une méthode de paiement depuis la base de données
 */
export const parsePaymentMethodFromDB = (method: string | undefined | null): PaymentMethod | null => {
  if (!method) return null;
  try {
    const parsed = JSON.parse(method);
    // Masquer les numéros de carte si présents
    if (parsed.type === 'credit_card' && parsed.details?.card_last_four) {
      return {
        ...parsed,
        details: {
          ...parsed.details,
          maskedNumber: `•••• •••• •••• ${parsed.details.card_last_four}`
        }
      };
    }
    return parsed;
  } catch {
    return null;
  }
};

/**
 * Formate une date pour la base de données
 */
export const formatDateForDB = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : date;
};

// =============================================
// SCHÉMAS POUR LES REQUÊTES API
// =============================================

// Schéma pour les données de requête de création
export const CreateUserRequestSchema = CreateUserSchema;

// Schéma pour les données de requête de mise à jour
export const UpdateUserRequestSchema = UpdateUserSchema;

// Schéma pour la réponse API d'un utilisateur
export const UserResponseSchema = UserSchema;

// Schéma pour la réponse API d'un utilisateur avec ses abonnements
export const UserWithSubscriptionsResponseSchema = UserWithSubscriptionsSchema;

// Schéma pour la réponse API d'un utilisateur avec ses services
export const UserWithServicesResponseSchema = UserWithServicesSchema;

// =============================================
// SCHÉMAS POUR LES FORMULAIRES
// =============================================

// Schéma pour un formulaire de création d'utilisateur
export const UserFormSchema = CreateUserSchema
  .omit({ password: true })
  .extend({
    password: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional()
  })
  .refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });

// Schéma pour un formulaire de mise à jour d'utilisateur
export const UpdateUserFormSchema = UpdateUserSchema;

// =============================================
// SCHÉMAS POUR LES ABONNEMENTS
// =============================================

// Schéma pour un abonnement
export const SubscriptionSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  service_id: IdSchema,
  status: z.string().min(1),
  start_date: DateSchema,
  end_date: DateSchema.nullable(),
  next_payment_date: DateSchema.nullable(),
  created_at: DateSchema,
  updated_at: DateSchema
});

// Schéma pour la création d'un abonnement
export const CreateSubscriptionSchema = z.object({
  user_id: IdSchema,
  service_id: IdSchema,
  status: z.string().min(1).optional().default('active'),
  start_date: DateSchema.optional().default(() => new Date()),
  end_date: DateSchema.nullable().optional(),
  next_payment_date: DateSchema.nullable().optional()
});

// Schéma pour la mise à jour d'un abonnement
export const UpdateSubscriptionSchema = z.object({
  status: z.string().min(1).optional(),
  start_date: DateSchema.optional(),
  end_date: DateSchema.nullable().optional(),
  next_payment_date: DateSchema.nullable().optional()
}).partial();

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleUser: User = {
  id: 1,
  email: 'user@example.com',
  password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrUQYt7YZz3zJZOZ5sZJ8J0l0Z5sZJ8',
  name: 'Jean Dupont',
  phone: '+33123456789',
  company: 'Entreprise XYZ',
  role: 'CLIENT',
  can_write: false,
  can_delete: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  billing_address: {
    street: '123 Rue Principale',
    city: 'Paris',
    state: 'Île-de-France',
    postalCode: '75000',
    country: 'France'
  },
  payment_method: {
    type: 'credit_card',
    details: {
      card_last_four: '4242',
      brand: 'visa',
      maskedNumber: '•••• •••• •••• 4242'
    }
  },
  service_ids: [1, 2, 3]
};

export const exampleCreateUser: CreateUser = {
  email: 'new.user@example.com',
  password: 'securePassword123!',
  name: 'Nouvel Utilisateur',
  phone: '+33612345678',
  company: 'Nouvelle Entreprise',
  role: 'CLIENT',
  can_write: false,
  can_delete: false,
  billing_address: {
    street: '456 Rue Secondaire',
    city: 'Lyon',
    postalCode: '69000',
    country: 'France'
  },
  payment_method: {
    type: 'credit_card',
    details: {
      card_last_four: '1234',
      brand: 'mastercard'
    }
  },
  service_ids: [1, 3]
};

export const exampleUserWithSubscriptions: UserWithSubscriptions = {
  ...exampleUser,
  subscriptions: [
    {
      id: 1,
      user_id: 1,
      service_id: 1,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: null,
      next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

export const exampleUserWithServices: UserWithServices = {
  ...exampleUser,
  services: [
    {
      id: 1,
      name: 'Service Basique',
      description: 'Accès aux fonctionnalités de base',
      route: '/basic',
      icon: 'basic-icon',
      price: 9.99,
      unit: 'mois',
      is_active: true
    },
    {
      id: 2,
      name: 'Service Premium',
      description: 'Accès à toutes les fonctionnalités premium',
      route: '/premium',
      icon: 'premium-icon',
      price: 19.99,
      unit: 'mois',
      is_active: true
    }
  ]
};
