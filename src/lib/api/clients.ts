// src/lib/api/clients.ts
import { emptyClient } from "@/src/Types/Clients/index";

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
