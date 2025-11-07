import { resourcesConfig } from './resources';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchResourceItem(resource: string, id: number) {
    
  const response = await fetch(`/api/admin/${resource}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch item');
  return response.json();
}

export async function updateResource(resource: string, id: number | undefined, data: any) {
  const url = `${API_URL}/api/admin/${resource}`;
  const method = id ? 'PUT' : 'POST';
  const body = JSON.stringify(id ? { id, ...data } : data);

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!response.ok) throw new Error('Failed to update resource');
  return response.json();
}


export async function getResourceById(resourceName: string, id: number) {
  // Appel à votre API ou base de données
  const response = await fetch(`/api/admin/${resourceName}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch resource');
  }
  return response.json();
}

export async function fetchResource(resource: string) {
//   const response = await fetch(`${API_URL}/api/admin/${resource}`);
//   if (!response.ok) throw new Error('Failed to fetch');
//   return response.json();
    return resourcesConfig[resource]?.fetchData();
}

export async function createResource(resource: string, prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const response = await fetch(`/api/admin/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create');
  return response.json();
}
