// src/lib/schemas/calendar.ts
import { z } from 'zod';

// =============================================
// SCHÉMAS DE BASE
// =============================================

// Schéma pour une date/heure (ISO string ou Date object)
export const DateTimeSchema = z.union([
  z.string().datetime(),
  z.date(),
  z.null()
]);

// Schéma pour un identifiant
export const IdSchema = z.string().transform((val) => parseInt(val));

// =============================================
// SCHÉMAS PRINCIPAUX
// =============================================

// Schéma pour un événement de calendrier
export const CalendarEventSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  title: z.string().min(1).max(255),
  start_time: DateTimeSchema,
  end_time: DateTimeSchema.optional(),
  description: z.string().max(1000).optional(),
  created_at: DateTimeSchema,
  updated_at: DateTimeSchema.optional()
});

// Schéma pour la création d'un événement
export const CreateCalendarEventSchema = z.object({
  user_id: IdSchema,
  title: z.string().min(1).max(255),
  start_time: DateTimeSchema,
  end_time: DateTimeSchema.optional(),
  description: z.string().max(1000).optional()
});

// Schéma pour la mise à jour d'un événement
export const UpdateCalendarEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  start_time: DateTimeSchema,
  end_time: DateTimeSchema.optional(),
  description: z.string().max(1000).optional()
}).partial();

// Schéma pour un événement avec des détails utilisateur
export const CalendarEventWithUserSchema = CalendarEventSchema.extend({
  user: z.object({
    id: IdSchema,
    name: z.string().min(1),
    email: z.string().email()
  })
});

// =============================================
// TYPES TYPESCRIPT (INFÉRÉS À PARTIR DES SCHÉMAS)
// =============================================

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
export type CreateCalendarEvent = z.infer<typeof CreateCalendarEventSchema>;
export type UpdateCalendarEvent = z.infer<typeof UpdateCalendarEventSchema>;
export type CalendarEventWithUser = z.infer<typeof CalendarEventWithUserSchema>;

// =============================================
// VALIDATEURS
// =============================================

/**
 * Valide les données de création d'un événement
 */
export const validateCreateCalendarEvent = (data: unknown): CreateCalendarEvent => {
  return CreateCalendarEventSchema.parse(data);
};

/**
 * Valide les données de mise à jour d'un événement
 */
export const validateUpdateCalendarEvent = (data: unknown): UpdateCalendarEvent => {
  return UpdateCalendarEventSchema.parse(data);
};

/**
 * Valide un événement complet
 */
export const validateCalendarEvent = (data: unknown): CalendarEvent => {
  return CalendarEventSchema.parse(data);
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
export const CreateCalendarEventRequestSchema = CreateCalendarEventSchema;

// Schéma pour les données de requête de mise à jour
export const UpdateCalendarEventRequestSchema = UpdateCalendarEventSchema;

// Schéma pour la réponse API d'un événement
export const CalendarEventResponseSchema = CalendarEventSchema;

// Schéma pour la réponse API d'un événement avec utilisateur
export const CalendarEventWithUserResponseSchema = CalendarEventWithUserSchema;

// =============================================
// SCHÉMAS POUR LES FORMULAIRES
// =============================================

// Schéma pour un formulaire de création d'événement
export const CalendarEventFormSchema = CreateCalendarEventSchema
  .extend({
    start_time: z.union([
      z.string().datetime(),
      z.date()
    ]).refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date de début invalide" }
    ),
    end_time: z.union([
      z.string().datetime(),
      z.date()
    ]).refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date de fin invalide" }
    )
  })
  .refine(
    (data) => {
      const start = data.start_time instanceof Date ?
        data.start_time :
        new Date(data.start_time);
      const end = data.end_time instanceof Date ?
        data.end_time :
        new Date(data.end_time);
      return end.getTime() > start.getTime();
    },
    {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["end_time"]
    }
  );

// Schéma pour un formulaire de mise à jour d'événement
export const UpdateCalendarEventFormSchema = UpdateCalendarEventSchema
  .extend({
    start_time: z.union([
      z.string().datetime(),
      z.date()
    ]).refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date de début invalide" }
    ).optional(),
    end_time: z.union([
      z.string().datetime(),
      z.date()
    ]).refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Date de fin invalide" }
    ).optional()
  })
  .refine(
    (data) => {
      if (!data.start_time && !data.end_time) return true;

      const start = data.start_time ?
        (data.start_time instanceof Date ?
          data.start_time :
          new Date(data.start_time)) :
        new Date();

      const end = data.end_time ?
        (data.end_time instanceof Date ?
          data.end_time :
          new Date(data.end_time)) :
        new Date(start.getTime() + 3600000); // +1 heure par défaut

      return end.getTime() > start.getTime();
    },
    {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["end_time"]
    }
  );

// =============================================
// SCHÉMAS POUR LES INTERVALLES DE DATES
// =============================================

// Schéma pour un intervalle de dates
export const DateRangeSchema = z.object({
  start: DateTimeSchema,
  end: DateTimeSchema
}).refine(
  (data) => {
    // Gestion de start
    const start = data.start === null ?
      new Date() : // Valeur par défaut si null
      (data.start instanceof Date ?
        data.start :
        new Date(data.start));
    // Gestion de end
    const end = data.end === null ?
      new Date(start.getTime() + 86400000) : // +1 jour par défaut si null
      (data.end instanceof Date ?
        data.end :
        new Date(data.end));
    return end.getTime() >= start.getTime();
  },
  {
    message: "La date de fin doit être postérieure ou égale à la date de début",
    path: ["end"]
  }
);

// =============================================
// EXEMPLES DE DONNÉES (POUR LES TESTS)
// =============================================

export const exampleCalendarEvent: CalendarEvent = {
  id: 1,
  user_id: 1,
  title: "Réunion d'équipe",
  start_time: new Date(Date.now() + 3600000).toISOString(), // Dans 1 heure
  end_time: new Date(Date.now() + 7200000).toISOString(), // Dans 2 heures
  description: "Réunion hebdomadaire pour discuter des projets en cours",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const exampleCreateCalendarEvent: CreateCalendarEvent = {
  user_id: 1,
  title: "Nouvel événement",
  start_time: new Date(Date.now() + 3600000), // Dans 1 heure
  end_time: new Date(Date.now() + 7200000), // Dans 2 heures
  description: "Description de l'événement"
};

export const exampleCalendarEventWithUser: CalendarEventWithUser = {
  ...exampleCalendarEvent,
  user: {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@example.com"
  }
};

export const exampleDateRange: z.infer<typeof DateRangeSchema> = {
  start: new Date().toISOString(),
  end: new Date(Date.now() + 86400000).toISOString() // +1 jour
};
