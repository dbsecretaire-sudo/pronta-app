'use server';

import { redirect } from 'next/navigation';
import { updateResource } from '@/src/lib/admin/api';
import { z, ZodError } from 'zod';

// Schémas de validation
import {
  CreateClient, CreateClientSchema, validateCreateClient,
  CreateCall, CreateCallSchema, validateCreateCall,
  CreateService, CreateServiceSchema, validateCreateService,
  CreateCalendarEvent, CreateCalendarEventSchema, validateCreateCalendarEvent,
  CreateInvoice, CreateInvoiceSchema, validateCreateInvoice,
  CreateSubscription, CreateSubscriptionSchema, validateCreateSubscription,
  CreateUser, CreateUserSchema, validateCreateUser
} from "@/src/lib/schemas";
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export type CreateResourceData =
  | CreateClient
  | CreateInvoice
  | CreateUser
  | CreateCall
  | CreateService
  | CreateCalendarEvent
  | CreateSubscription
  | Record<string, any>;

export type FormState = {
  error?: string;
  success?: boolean;
  data?: any;
};

export const getCreateSchema = async (resourceName: string) => {
    switch (resourceName) {
      case 'clients':
        return CreateClientSchema;
      case 'invoices':
        return CreateInvoiceSchema;
      case 'users':
        return CreateUserSchema;
      case 'calls':
        return CreateCallSchema;
      case 'services' :
        return CreateServiceSchema;
      case 'calendar' :
        return CreateCalendarEventSchema;
      case 'subscriptions' :
        return CreateSubscriptionSchema
      default:
        throw new Error(`No schema defined for resource: ${resourceName}`);
    }
  };


export async function createResource(
  resource: string,
  prevState: FormState,
  formData: FormData,
  // accessToken: string,
): Promise<FormState> {
  const currentSession = await getServerSession(authOptions);
  const accessToken = currentSession?.accessToken ?? null;

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
        duration: convertTimeToSeconds(data.duration.toString()),          //ici il faut convertir 03:20 en nombre de secondes
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

    } else if (resource === 'subscriptions') {
      if (typeof data.start_date !== 'string' || typeof data.end_date !== 'string'||typeof data.next_payment_date !== 'string') {
        return { error: "La date est invalide" };
      }

      const rawData = {
        ...data,
        start_date: new Date(data.start_date).toISOString().split('T')[0],  // Conversion en ISO
        end_date: new Date(data.end_date).toISOString().split('T')[0],  // Conversion en ISO
        next_payment_date: new Date(data.next_payment_date).toISOString().split('T')[0],  // Conversion en ISO
      };
console.log(rawData);
      validatedData = validateCreateInvoice(rawData);
    } else if (resource === 'users') {

      const serviceIds = formData.getAll('service_ids[]');
      const serviceIdsArray = serviceIds.map((id) => parseInt(id as string, 10));

      const rawData = {
          password: formData.get('password'),
          email: formData.get('email'),
          name: formData.get('name'),
          role: formData.get('role'),
          can_write: formData.get('can_write') !== null,
          can_delete: formData.get('can_delete') !== null,
          // Construis manuellement l'objet address
          billing_address: {
            street: formData.get('street'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country') || 'France',
          },
          payment_method:{
            type: formData.get('type'),
            details: {
              card_last_four: formData.get('card_last_four'),
              card_number: formData.get('card_number'),
              card_brand: formData.get('card_brand'),
              paypal_email: formData.get('paypal_email'),
            }
          },
          service_ids: serviceIdsArray,
        };

      validatedData = validateCreateUser(rawData);
    } else {
      return { error: "Ressource non supportée" };
    }
    // Appel à ta fonction updateResource
    const result = await updateResource(accessToken, resource, undefined, validatedData);
    if(result.success === true){
      redirect(`/admin/${resource}`);
    };
    return result;
  } catch (error: any) {
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error; // Re-lancez l'erreur de redirection pour qu'elle soit gérée par Next.js
    }
    return { error: error.message || "Une erreur est survenue" };
  }
}

function convertTimeToSeconds(timeString: string): number {
  // 1. Vérifiez que timeString est au format "HH:MM"
  if (!timeString || typeof timeString !== 'string') {
    return 0; // Valeur par défaut si invalide
  }

  // 2. Séparez les heures et les minutes
  const [minutes, secondes] = timeString.split(':').map(Number);

  // 3. Calculez le total en secondes
  return (minutes * 60) + (secondes * 1);
}