'use server';

import { redirect } from 'next/navigation';
import { updateResource } from '@/src/lib/admin/api';
import { z, ZodError } from 'zod';

// Schémas de validation
const clientSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide"),
});

const callSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Date invalide"),
});

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
      validatedData = clientSchema.parse(data);
    } else if (resource === 'calls') {
      validatedData = callSchema.parse(data);
    } else {
      return { error: "Ressource non supportée" };
    }

    // Appel à ta fonction updateResource
    await updateResource(resource, undefined, validatedData);

    // Redirection après succès
    redirect(`/admin/${resource}`);
  } catch (error) {
    if (error instanceof ZodError) {
      // Utilise error.issues pour accéder aux détails des erreurs
      return { error: error.issues[0].message };
    } else {
      // Autre erreur (base de données, etc.)
      console.error(error);
      return { error: "Échec de la création de la ressource" };
    }
  }
}
