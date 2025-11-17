// src/lib/api/clients.ts
import { Client } from "@/src/Components";
import { emptyClient } from "@/src/Types/Clients/index";
import { getSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createClient = async (clientData: typeof emptyClient) => {
  try {
    const currentSession = await getSession();
    if (!currentSession) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const response = await fetch('/api/clients', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentSession.accessToken}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchAllClients = async (accessToken: string | null): Promise<Client[]> => {
  const res = await fetch(`${API_URL}/api/clients`, { 
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
