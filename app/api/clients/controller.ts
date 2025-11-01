// app/api/clients/controller.ts
import { ClientService } from './service'; // Adaptez le chemin

const clientService = new ClientService();

export const getClientsByUserId = async (userId: number) => {
  return await clientService.getClientsByUserId(userId);
};

export const searchClients = async ({ query, userId }: { query: string; userId: number }) => {
  return await clientService.searchClients({searchTerm: query, userId: userId});
};

export const getClientById = async (id: number) => {
  return await clientService.getClientById(id);
};

export const createClient = async (clientData: any) => {
  return await clientService.createClient(clientData);
};

export const updateClient = async (id: number, clientData: any) => {
  return await clientService.updateClient(id, clientData);
};

export const deleteClient = async (id: number) => {
  return await clientService.deleteClient(id);
};
