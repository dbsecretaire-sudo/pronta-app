// src/lib/api/clients.ts
import { Client } from "@/src/Components";
import { emptyClient } from "@/src/Types/Clients/index";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createClient = async (clientData: typeof emptyClient) => {
  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    throw error;
  }
};

export const fetchAllClients = async (): Promise<Client[]> => {
  const res = await fetch(`${API_URL}/api/clients`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
