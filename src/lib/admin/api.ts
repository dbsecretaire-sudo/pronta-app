import { resourcesConfig } from './resources';
import { FormState } from '@/app/actions/admin';
import { useAuthCheck } from '@/src/Hook/useAuthCheck';
import { Invoice } from "@/src/Types/Invoices";
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchResourceItem<T>(resource: string, id: number, accessToken: string | null): Promise<T> {
  return safeFetch<T>(accessToken, `/api/admin/${resource}/${id}`);
}

export async function updateResource(accessToken: string | null, resource: string, id: number | undefined, data: any): Promise<FormState> {
  let url: string;
  let method: 'POST' | 'PUT';

  if (id) {
    method = 'PUT';
    url = `${API_URL}/api/admin/${resource}/${id}`;
  } else {
    method = 'POST';
    url = `${API_URL}/api/admin/${resource}`;
  }

  try {
     

    const response = await fetch(url, { 
      method, 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
      }, 
      credentials: 'include', 
      body: JSON.stringify(id ? { id, ...data } : data) 
    });

    if(!response.ok){
        const errorData = await response.json();
        return { success: false, error: errorData.error || response.statusText };
    } else {
      return { success: true, data: {} };
    }

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getResourceById(resourceName: string, id: number, accessToken : string | null) {
  // Appel à votre API ou base de données
  if(resourceName === 'invoices'){
    
     

    const [invoiceResponse, itemsResponse] = await Promise.all([
      fetch(`/api/admin/invoices/${id}`, { 
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
        },
      }),
      fetch(`/api/invoices/${id}/items`, {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
        },
      }), // Endpoint dédié aux items
    ]);

    if (!invoiceResponse.ok || !itemsResponse.ok) {
      throw new Error('Failed to fetch invoice or items');
    }

    const invoiceData = await invoiceResponse.json();
    const itemsData = await itemsResponse.json();

    // Fusionne les données
    return {
      ...invoiceData,
      items: itemsData, // Ajoute les items à la facture
    };
  } else {
     

    const response = await fetch(`/api/admin/${resourceName}/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch resource');
    }
    return response.json();
  }
}

export async function fetchResource(accessToken: string | null, resource: string) {
     

//   const response = await fetch(`${API_URL}/api/admin/${resource}`);
//   if (!response.ok) throw new Error('Failed to fetch');
//   return response.json();
    return resourcesConfig[resource]?.fetchData(accessToken);
}

export async function createResource(resource: string, prevState: any, formData: FormData, accessToken: string | null) {
  const data = Object.fromEntries(formData.entries());

  const response = await fetch(`/api/admin/${resource}`, {
    method: 'POST',
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create');
  return response.json();
}


// src/lib/api.ts
export async function safeFetch<T>(
  accessToken: string | null,
  url: string,
  config?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...config,
      credentials: 'include', // <-- Toujours inclure les cookies
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
        ...config?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Erreur ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Erreur lors de la requête vers ${url}:`, error);
    throw error; // <-- Relance l'erreur pour une gestion supérieure
  }
}
