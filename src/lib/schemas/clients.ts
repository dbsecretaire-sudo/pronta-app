// src/lib/schemas/client.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma pour un identifiant
export const IdSchema = z.string().transform((val) => parseInt(val));

// Schéma pour une adresse
export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1)
}).partial();

// Schéma pour un numéro de téléphone
export const PhoneSchema = z.string()
  .min(5)
  .max(20)
  .refine(phone => /^\+?[0-9\s\-\(\)]{5,}$/.test(phone), {
    message: "Numéro de téléphone invalide"
  });

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma de base pour un client
export const ClientSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: PhoneSchema.optional(),
  address: AddressSchema.optional(),
  company: z.string().min(1).max(255).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional()
});

// Schéma pour la création d'un client
export const CreateClientSchema = z.object({
  user_id: IdSchema,
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: PhoneSchema.optional(),
  address: AddressSchema.optional(),
  company: z.string().min(1).max(255).optional()
});

// Schéma pour la mise à jour d'un client
export const UpdateClientSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: PhoneSchema.optional(),
  address: AddressSchema.optional(),
  company: z.string().min(1).max(255).optional()
}).partial();

// Schéma pour les données de formulaire de client
export const ClientFormDataSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: PhoneSchema.optional(),
  address: AddressSchema.optional(),
  company: z.string().min(1).max(255).optional()
});

// Schéma pour un client avec des détails utilisateur
export const ClientWithUserSchema = ClientSchema.extend({
  user: z.object({
    id: IdSchema,
    name: z.string().min(1),
    email: z.string().email()
  })
});

// =============================================
// SCHÉMAS POUR LES FILTRES
// =============================================

// Schéma pour les filtres de clients
export const ClientFilterSchema = z.object({
  userId: IdSchema.optional(),
  searchTerm: z.string().min(1).optional()
});

// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type Client = z.infer<typeof ClientSchema>;
export type CreateClient = z.infer<typeof CreateClientSchema>;
export type UpdateClient = z.infer<typeof UpdateClientSchema>;
export type ClientFormData = z.infer<typeof ClientFormDataSchema>;
export type ClientWithUser = z.infer<typeof ClientWithUserSchema>;
export type ClientFilter = z.infer<typeof ClientFilterSchema>;
export type Address = z.infer<typeof AddressSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'un client
 */
export const validateCreateClient = (data: unknown): CreateClient => {
  return CreateClientSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'un client
 */
export const validateUpdateClient = (data: unknown): UpdateClient => {
  return UpdateClientSchema.parse(data);
};

/**
 * Valide un client complet
 */
export const validateClient = (data: unknown): Client => {
  return ClientSchema.parse(data);
};

/**
 * Valide les données de formulaire de client
 */
export const validateClientFormData = (data: unknown): ClientFormData => {
  return ClientFormDataSchema.parse(data);
};

/**
 * Valide les filtres de clients
 */
export const validateClientFilter = (data: unknown): ClientFilter => {
  return ClientFilterSchema.parse(data);
};

// =============================================
// FONCTIONS D'AIDE POUR LES DONNÉES
// =============================================

/**
 * Formate une adresse pour la base de données
 */
export const formatAddressForDB = (address: Address | undefined | null): string | null => {
  if (!address) return null;
  return JSON.stringify(address);
};

/**
 * Parse une adresse depuis la base de données
 */
export const parseAddressFromDB = (address: string | undefined | null): Address | null => {
  if (!address) return null;
  try {
    return JSON.parse(address);
  } catch {
    return null;
  }
};

// =============================================
// SCHÉMAS POUR LES REQUÊTES API
// =============================================

// Schéma pour les données de requête de création
export const CreateClientRequestSchema = CreateClientSchema;

// Schéma pour les données de requête de mise à jour
export const UpdateClientRequestSchema = UpdateClientSchema;

// Schéma pour la réponse API d'un client
export const ClientResponseSchema = ClientSchema;

// Schéma pour la réponse API d'un client avec utilisateur
export const ClientWithUserResponseSchema = ClientWithUserSchema;

// =============================================
// SCHÉMAS POUR LES FORMULAIRES
// =============================================

// Schéma pour un formulaire de création de client
export const ClientCreateFormSchema = ClientFormDataSchema
  .extend({
    confirmEmail: z.string().email()
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Les adresses email ne correspondent pas",
    path: ["confirmEmail"]
  });

// Schéma pour un formulaire de mise à jour de client
export const ClientUpdateFormSchema = UpdateClientSchema;

// =============================================
// FONCTIONS UTILITAIRES POUR LES REQUÊTES SQL
// =============================================

/**
 * Génère une requête SQL pour filtrer les clients
 */
export const generateClientFilterQuery = (filter: ClientFilter): { query: string, params: any[] } => {
  let query = "SELECT * FROM clients WHERE 1=1";
  const params: any[] = [];

  if (filter.userId) {
    query += ` AND user_id = $${params.length + 1}`;
    params.push(filter.userId);
  }

  if (filter.searchTerm) {
    query += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR company ILIKE $${params.length + 1})`;
    params.push(`%${filter.searchTerm}%`);
  }

  query += ' ORDER BY name';

  return { query, params };
};

/**
 * Génère une requête SQL pour créer un client
 */
export const generateCreateClientQuery = (client: CreateClient): { query: string, params: any[] } => {
  const query = `
    INSERT INTO clients (user_id, name, email, phone, address, company)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const params = [
    client.user_id,
    client.name,
    client.email,
    client.phone,
    client.address ? formatAddressForDB(client.address) : null,
    client.company
  ];

  return { query, params };
};

/**
 * Génère une requête SQL pour mettre à jour un client
 */
export const generateUpdateClientQuery = (id: number, client: UpdateClient): { query: string, params: any[] } => {
  const entries = Object.entries(client).filter(([_, value]) => value !== undefined);
  if (entries.length === 0) {
    return {
      query: 'SELECT * FROM clients WHERE id = $1',
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
    UPDATE clients
    SET ${fields}, updated_at = NOW()
    WHERE id = $${entries.length + 1}
    RETURNING *
  `;

  return { query, params: [...values, id] };
};

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleClient: Client = {
  id: 1,
  user_id: 1,
  name: "Entreprise XYZ",
  email: "contact@entreprise-xyz.com",
  phone: "+33123456789",
  address: {
    street: "123 Rue Principale",
    city: "Paris",
    state: "Île-de-France",
    postalCode: "75000",
    country: "France"
  },
  company: "Entreprise XYZ",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const exampleCreateClient: CreateClient = {
  user_id: 1,
  name: "Nouvelle Entreprise",
  email: "contact@nouvelle-entreprise.com",
  phone: "+33654321987",
  address: {
    street: "456 Rue Secondaire",
    city: "Lyon",
    postalCode: "69000",
    country: "France"
  },
  company: "Nouvelle Entreprise"
};

export const exampleClientWithUser: ClientWithUser = {
  ...exampleClient,
  user: {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@example.com"
  }
};

export const exampleClientFormData: ClientFormData = {
  name: "Nouvelle Entreprise",
  email: "contact@nouvelle-entreprise.com",
  phone: "+33654321987",
  address: {
    street: "456 Rue Secondaire",
    city: "Lyon",
    postalCode: "69000",
    country: "France"
  },
  company: "Nouvelle Entreprise"
};

export const exampleClientFilter: ClientFilter = {
  userId: 1,
  searchTerm: "Entreprise"
};
