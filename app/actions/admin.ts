'use server';

import { redirect } from 'next/navigation';
import { updateResource } from '@/src/lib/admin/api';
import { z, ZodError } from 'zod';

// Schémas de validation
import {
  CreateClientSchema, validateCreateClient,
  CreateCallSchema, validateCreateCall,
  CreateServiceSchema, validateCreateService,
  CreateCalendarEventSchema, validateCreateCalendarEvent,
  CreateInvoiceSchema, validateCreateInvoice,
  CreateSubscriptionSchema, validateCreateSubscription,
  CreateUserSchema, validateCreateUser
} from "@/src/lib/schemas";

export type FormState = {
  error?: string;
  success?: boolean;
};

export async function createResource(
  resource: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const data = Object.fromEntries(formData.entries());
    // Validation selon la ressource
    let validatedData;

    if (resource === 'clients') {

        const rawData = {
          user_id: formData.get('user_id'),
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          company: formData.get('company'),
          // Construis manuellement l'objet address
          address: {
            street: formData.get('street'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country') || 'France',
            // state: formData.get('state')
          }
        };

        // 2. Valide avec ton schéma
        validatedData = validateCreateClient(rawData);

    } else if (resource === 'calls') {

      if (typeof data.date !== 'string') {
        return { error: "La date est invalide" };
      }

      const rawData = {
        ...data,
        date: new Date(data.date).toISOString(),  // Conversion en ISO
        duration: Number(data.duration),          // Conversion en number
      };

      validatedData = validateCreateCall(rawData);
    } else if (resource === 'services') {
      validatedData = validateCreateService(data);
    } else if (resource === 'calendar') {
      
      if (typeof data.end_time !== 'string' || typeof data.start_time !== 'string') {
        return { error: "La date est invalide" };
      }

      const rawData = {
        ...data,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
      }

      validatedData = validateCreateCalendarEvent(rawData);
    } else if (resource === 'invoices') {

      if (typeof data.due_date !== 'string') {
        return { error: "La date est invalide" };
      }

      const rawData = {
        ...data,
        items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items,
        due_date: new Date(data.due_date).toISOString(),  // Conversion en ISO
      };

      validatedData = validateCreateInvoice(rawData);

    } else if (resource === 'subscription') {
      validatedData = validateCreateSubscription(data);
    } else if (resource === 'users') {
      validatedData = validateCreateUser(data);
    } else {
      return { error: "Ressource non supportée" };
    }
    // Appel à ta fonction updateResource
    await updateResource(resource, undefined, validatedData);

    // Redirection après succès
    redirect(`/admin/${resource}`);
  } catch (error) {
  if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
    throw error; // Relance pour la redirection
  }
  console.error("Erreur complète dans createResource:", error);
  if (error instanceof ZodError) {
    return { error: error.issues[0].message };
  } else if (error instanceof Error) {
    return { error: error.message || "Échec de la création de la ressource" };
  } else {
    return { error: "Échec de la création de la ressource" };
  }
}
}