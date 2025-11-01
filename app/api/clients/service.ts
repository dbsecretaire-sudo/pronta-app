import { ClientModel, Client, CreateClient, ClientFilter } from "./types";
import { validateClient } from "./utils";

export class ClientService {
  private clientModel = new ClientModel({} as Client);

  async getClientsByUserId(userId: number): Promise<Client[]> {
    return this.clientModel.getClientsByUserId(userId);
  }

  async getClientById(id: number): Promise<Client | null> {
    return this.clientModel.getClientById(id);
  }

  async searchClients(filters: ClientFilter): Promise<Client[]> {
    return this.clientModel.searchClients(filters);
  }

  async createClient(client: CreateClient): Promise<Client> {
    if (!validateClient(client)) {
      throw new Error("Name and email are required");
    }
    return this.clientModel.createClient(client);
  }

  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    return this.clientModel.updateClient(id, client);
  }

  async deleteClient(id: number): Promise<void> {
    return this.clientModel.deleteClient(id);
  }
}
