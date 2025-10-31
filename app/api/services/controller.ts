import { Request, Response } from "express";
import { ServiceService } from "./service";

const serviceService = new ServiceService();

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(Number(id));
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = req.body;
    const newService = await serviceService.createService(service);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: "Failed to create service" });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = req.body;
    const updatedService = await serviceService.updateService(Number(id), service);
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: "Failed to update service" });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await serviceService.deleteService(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};
