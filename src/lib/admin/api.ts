import { resourcesConfig } from './resources';
import { FormState } from '@/app/actions/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchResourceItem(resource: string, id: number) {
    
  const response = await fetch(`/api/admin/${resource}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch item');
  return response.json();
}

export async function updateResource(resource: string, id: number | undefined, data: any): Promise<FormState> {
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
    const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id, ...data } : data), });
    if(!response.ok){
        const errorData = await response.json();
        return { success: false, error: errorData.error || response.statusText };
    } else {
      return { success: true, data: {} };
    }

  } catch (error: any) {
    console.error("Erreur serveur:", error); 
    return { success: false, error: error.message };
  }
}

export async function getResourceById(resourceName: string, id: number) {
  // Appel à votre API ou base de données
  if(resourceName === 'invoices'){
    const [invoiceResponse, itemsResponse] = await Promise.all([
      fetch(`/api/admin/invoices/${id}`),
      fetch(`/api/invoices/${id}/items`), // Endpoint dédié aux items
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
     const response = await fetch(`/api/admin/${resourceName}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resource');
    }
    return response.json();
  }
}

export async function fetchResource(resource: string) {
//   const response = await fetch(`${API_URL}/api/admin/${resource}`);
//   if (!response.ok) throw new Error('Failed to fetch');
//   return response.json();
    return resourcesConfig[resource]?.fetchData();
}

export async function createResource(resource: string, prevState: any, formData: FormData) {
  console.log('Hello createResource from src/lib/admin/api.ts (S1)');
  const data = Object.fromEntries(formData.entries());
  const response = await fetch(`/api/admin/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create');
  return response.json();
}
