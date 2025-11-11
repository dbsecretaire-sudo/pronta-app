import { Client, CreateClient, ClientFormData, ClientFilter } from './type';
// import interface Client {
//   id: number;
//   user_id: number;
//   name: string;
//   email: string;
//   phone?: string;
//   address?: typeof AddressSchema;
//   company?: string;
//   created_at: string;
//   updated_at?: string;
// }
// import Client
import pool from "@/src/lib/db";
import { Address, AddressSchema, CreateClientSchema } from "@/src/lib/schemas/clients"; // Suppose que tu as un schéma Zod pour CreateClient
import { z } from "zod";

export class ClientModel {
  constructor(public data: Client) {}

  // Méthode pour afficher le nom complet
  getFullName(): string {
    return `${this.data.name} (${this.data.email})`;
  }

  get address(): Address | undefined {
    return this.data.address;
  }
  
  set address(value: Address | null | undefined) {
    this.data.address = value === null ? undefined : value;
  }

  // Méthode pour sérialiser l'adresse avant insertion en base
  private serializeAddress(): string | null {
    return this.data.address ? JSON.stringify(this.data.address) : null;
  }

  // Méthode pour désérialiser l'adresse après récupération de la base
  private static deserializeAddress(address: string | null): Address | null {
    return address ? JSON.parse(address) : null;
  }

  //Méthode pour créer un nouveau client
  async createClient(client: CreateClient): Promise<Client> {
    const serializedAddress = client.address ? JSON.stringify(client.address) : null;
    const res = await pool.query(
      `INSERT INTO clients (user_id, name, email, phone, address, company)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [client.user_id, client.name, client.email, client.phone, serializedAddress, client.company]
    );

    // Désérialise l'adresse après récupération
    const result = res.rows[0];
    if (result.address) {
      result.address = ClientModel.deserializeAddress(result.address);
    }
    return result;
  }

  // Méthode pour Mettre à jour un client
async updateClient(id: number, client: Partial<Client>): Promise<Client> {
  const serializedAddress = client.address ? JSON.stringify(client.address) : null;
  const entries = Object.entries(client)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => [
      key,
      key === 'address' ? serializedAddress : value,
    ]);

    if (entries.length === 0) {
        const res = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
        return res.rows[0];
    }

    const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const values = entries.map(([_, value]) => value);

    const res = await pool.query(
        `UPDATE clients SET ${fields}, updated_at = NOW() WHERE id = $${entries.length + 1} RETURNING *`,
        [...values, id]
    );

    return res.rows[0];
  }

  // Méthode pour valider les données avant création
    static validate(input: CreateClient): boolean {
      try {
        CreateClientSchema.parse(input);
        return true;
      } catch (error) {
        return false;
      }
    }

  // Méthode pour créer une instance depuis les données brutes
  static fromData(data: Client): ClientModel {
    return new ClientModel(data);
  }

  // Méthode pour Supprimer un client
  async deleteClient(id: number): Promise<void> {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
  }

  // Méthode pour Récupérer tous les clients d'un utilisateur
  async getClientsByUserId(userId: number): Promise<Client[]> {
    const res = await pool.query(
        'SELECT * FROM clients WHERE user_id = $1 ORDER BY name',
        [userId]
    );
    return res.rows;
  }

  async getAllClients(): Promise<Client[]> {
    const res = await pool.query(
        'SELECT * FROM clients'
    );
    return res.rows;
  }

  //Méthode pour créer une instance depuis un formulaire
  static fromFormData(formData: ClientFormData, userId?: number): CreateClient {
    if (userId === undefined) {
      throw new Error("userId is required");
    }
    return {
      ...formData,
      user_id: userId,
    };
  }

  // Récupérer un client par son ID
  async getClientById(id: number): Promise<Client | null> {
    const res = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    const client = res.rows[0];
    if (client?.address) {
      client.address = ClientModel.deserializeAddress(client.address);
    }
    return client || null;
  }

  async searchClients(filters: ClientFilter): Promise<Client[]> {
    let query = "SELECT * FROM clients WHERE 1=1";
    const params = [];

    if (filters.userId) {
      query += " AND user_id = $1";
      params.push(filters.userId);
    }

    if (filters.searchTerm) {
      query += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR company ILIKE $${params.length + 1})`;
      params.push(`%${filters.searchTerm}%`);
    }

    const res = await pool.query(query, params);
    return res.rows;
  }

}