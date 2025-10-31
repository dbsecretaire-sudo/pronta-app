import { Request, Response } from "express";
import { ClientService } from "./service";
import { formatClientForResponse } from "./utils";

const clientService = new ClientService();

export const getClientsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const clients = await clientService.getClientsByUserId(Number(userId));
    res.status(200).json(clients.map(formatClientForResponse));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await clientService.getClientById(Number(id));
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.status(200).json(formatClientForResponse(client));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch client" });
  }
};

export const searchClients = async (req: Request, res: Response) => {
  try {
    const { userId, searchTerm } = req.query;
    const clients = await clientService.searchClients({
      userId: userId ? Number(userId) : undefined,
      searchTerm: searchTerm as string,
    });
    res.status(200).json(clients.map(formatClientForResponse));
  } catch (error) {
    res.status(500).json({ error: "Failed to search clients" });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = req.body;
    const newClient = await clientService.createClient(client);
    res.status(201).json(formatClientForResponse(newClient));
  } catch (error) {
    res.status(500).json({ error: "Failed to create client" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = req.body;
    const updatedClient = await clientService.updateClient(Number(id), client);
    res.status(200).json(formatClientForResponse(updatedClient));
  } catch (error) {
    res.status(500).json({ error: "Failed to update client" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await clientService.deleteClient(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client" });
  }
};
