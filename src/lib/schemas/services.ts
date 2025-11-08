// src/lib/schemas/service.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma pour un identifiant
export const IdSchema = z.number().int().positive();

// Schéma pour un prix
export const PriceSchema = z.string().transform((val) => parseFloat(val));

// Schéma pour une unité de temps/facturation
export const UnitSchema = z.enum([
  'heure',
  'jour',
  'semaine',
  'mois',
  'année',
  'appel',
  'projet'
]);

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma de base pour un service
export const ServiceSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  route: z.string().min(1).max(255),
  icon: z.string().min(1).max(100).optional(),
  price: PriceSchema,
  unit: UnitSchema,
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional()
});

// Schéma pour la création d'un service
export const CreateServiceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  route: z.string().min(1).max(255),
  icon: z.string().min(1).max(100).optional(),
  price: PriceSchema,
  unit: UnitSchema,
  is_active: z.boolean().optional().default(true)
});

// Schéma pour la mise à jour d'un service
export const UpdateServiceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  route: z.string().min(1).max(255).optional(),
  icon: z.string().min(1).max(100).optional(),
  price: PriceSchema.optional(),
  unit: UnitSchema.optional(),
  is_active: z.boolean().optional()
}).partial();

// Schéma pour un service avec des détails supplémentaires
export const ServiceWithDetailsSchema = ServiceSchema.extend({
  subscriptions_count: z.number().int().nonnegative().optional(),
  active_subscriptions_count: z.number().int().nonnegative().optional()
});

// =============================================
// SCHÉMAS POUR LES FILTRES
// =============================================

// Schéma pour les filtres de services
export const ServiceFilterSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  minPrice: PriceSchema.optional(),
  maxPrice: PriceSchema.optional(),
  unit: UnitSchema.optional()
});

// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type Service = z.infer<typeof ServiceSchema>;
export type CreateService = z.infer<typeof CreateServiceSchema>;
export type UpdateService = z.infer<typeof UpdateServiceSchema>;
export type ServiceWithDetails = z.infer<typeof ServiceWithDetailsSchema>;
export type ServiceFilter = z.infer<typeof ServiceFilterSchema>;
export type Unit = z.infer<typeof UnitSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'un service
 */
export const validateCreateService = (data: unknown): CreateService => {
  return CreateServiceSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'un service
 */
export const validateUpdateService = (data: unknown): UpdateService => {
  return UpdateServiceSchema.parse(data);
};

/**
 * Valide un service complet
 */
export const validateService = (data: unknown): Service => {
  return ServiceSchema.parse(data);
};

/**
 * Valide les filtres de services
 */
export const validateServiceFilter = (data: unknown): ServiceFilter => {
  return ServiceFilterSchema.parse(data);
};

// =============================================
// FONCTIONS D'AIDE POUR LES DONNÉES
// =============================================

/**
 * Formate un service pour la base de données
 */
export const formatServiceForDB = (service: CreateService | UpdateService): any => {
  return {
    ...service,
    is_active: service.is_active ?? true
  };
};

// =============================================
// SCHÉMAS POUR LES REQUÊTES API
// =============================================

// Schéma pour les données de requête de création
export const CreateServiceRequestSchema = CreateServiceSchema;

// Schéma pour les données de requête de mise à jour
export const UpdateServiceRequestSchema = UpdateServiceSchema;

// Schéma pour la réponse API d'un service
export const ServiceResponseSchema = ServiceSchema;

// Schéma pour la réponse API d'un service avec détails
export const ServiceWithDetailsResponseSchema = ServiceWithDetailsSchema;

// =============================================
// SCHÉMAS POUR LES FORMULAIRES
// =============================================

// Schéma pour un formulaire de création de service
export const ServiceFormSchema = CreateServiceSchema.extend({
  confirmName: z.string().min(1).max(255)
}).refine(
  (data) => data.name === data.confirmName,
  {
    message: "Les noms ne correspondent pas",
    path: ["confirmName"]
  }
);

// Schéma pour un formulaire de mise à jour de service
export const UpdateServiceFormSchema = UpdateServiceSchema;

// =============================================
// FONCTIONS UTILITAIRES POUR LES REQUÊTES SQL
// =============================================

/**
 * Génère une requête SQL pour filtrer les services
 */
export const generateServiceFilterQuery = (filter: ServiceFilter): { query: string, params: any[] } => {
  let query = "SELECT * FROM services WHERE 1=1";
  const params: any[] = [];
  let paramIndex = 1;

  if (filter.name) {
    query += ` AND name ILIKE $${paramIndex}`;
    params.push(`%${filter.name}%`);
    paramIndex++;
  }

  if (filter.isActive !== undefined) {
    query += ` AND is_active = $${paramIndex}`;
    params.push(filter.isActive);
    paramIndex++;
  }

  if (filter.minPrice) {
    query += ` AND price >= $${paramIndex}`;
    params.push(filter.minPrice);
    paramIndex++;
  }

  if (filter.maxPrice) {
    query += ` AND price <= $${paramIndex}`;
    params.push(filter.maxPrice);
    paramIndex++;
  }

  if (filter.unit) {
    query += ` AND unit = $${paramIndex}`;
    params.push(filter.unit);
    paramIndex++;
  }

  query += " ORDER BY name";

  return { query, params };
};

/**
 * Génère une requête SQL pour créer un service
 */
export const generateCreateServiceQuery = (service: CreateService): { query: string, params: any[] } => {
  const query = `
    INSERT INTO services (name, description, route, icon, price, unit, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const params = [
    service.name,
    service.description,
    service.route,
    service.icon,
    service.price,
    service.unit,
    service.is_active ?? true
  ];

  return { query, params };
};

/**
 * Génère une requête SQL pour mettre à jour un service
 */
export const generateUpdateServiceQuery = (id: number, service: UpdateService): { query: string, params: any[] } => {
  const entries = Object.entries(service).filter(([_, value]) => value !== undefined);
  if (entries.length === 0) {
    return {
      query: 'SELECT * FROM services WHERE id = $1',
      params: [id]
    };
  }

  const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
  const values = entries.map(([_, value]) => value);

  const query = `
    UPDATE services
    SET ${fields}
    WHERE id = $${entries.length + 1}
    RETURNING *
  `;

  return { query, params: [...values, id] };
};

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleService: Service = {
  id: 1,
  name: "Service de Consultation",
  description: "Service de consultation professionnel pour les entreprises",
  route: "/consultation",
  icon: "consulting-icon",
  price: 99.99,
  unit: "heure",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const exampleCreateService: CreateService = {
  name: "Nouveau Service Premium",
  description: "Service premium avec accès à toutes les fonctionnalités avancées",
  route: "/premium",
  icon: "premium-icon",
  price: 199.99,
  unit: "mois",
  is_active: true
};

export const exampleServiceWithDetails: ServiceWithDetails = {
  ...exampleService,
  subscriptions_count: 42,
  active_subscriptions_count: 35
};

export const exampleServiceFilter: ServiceFilter = {
  name: "consult",
  isActive: true,
  minPrice: 50,
  maxPrice: 200,
  unit: "heure"
};
