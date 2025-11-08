'use server';

import { redirect } from 'next/navigation';
import { updateResource } from '@/src/lib/admin/api';
import { z, ZodError } from 'zod';

// Schémas de validation
import {
  CreateClientSchema,
  validateCreateClient
} from "@/src/lib/schemas/clients";
import {
  CreateCallSchema,
  validateCreateCall
} from "@/src/lib/schemas/calls";
import {
  CreateServiceSchema,
  validateCreateService
} from "@/src/lib/schemas/services";
import {
  CreateCalendarEventSchema,
  validateCreateCalendarEvent
} from "@/src/lib/schemas/calendar";
import {
  CreateInvoiceSchema,
  validateCreateInvoice
} from "@/src/lib/schemas/invoices";
import {
  CreateSubscriptionSchema,
  validateCreateSubscription
} from "@/src/lib/schemas/subscription";
import {
  CreateUserSchema,
  validateCreateUser
} from "@/src/lib/schemas/users";

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
      validatedData = validateCreateCall(data);
    } else if (resource === 'services') {
      validatedData = validateCreateService(data);
    } else if (resource === 'calendar') {
      validatedData = validateCreateCalendarEvent(data);
    } else if (resource === 'invoices') {
      validatedData = validateCreateInvoice(data);
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