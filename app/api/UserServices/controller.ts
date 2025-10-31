import { Request, Response } from "express";
import { UserServiceService } from "./service";
import { UpdateUserServicePermissions } from "./types";

const userServiceService = new UserServiceService();

export const getUserServices = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const services = await userServiceService.getUserServices(Number(userId));
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user services" });
  }
};

export const getUserService = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.params;
    const service = await userServiceService.getUserService(Number(userId), Number(serviceId));
    if (!service) return res.status(404).json({ error: "Service not found for this user" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user service" });
  }
};

export const assignServiceToUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { serviceId } = req.body;
    const userService = await userServiceService.assignServiceToUser({
      user_id: Number(userId),
      service_id: serviceId,
    });
    res.status(201).json(userService);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign service to user" });
  }
};

export const updateUserService = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.params;
    const permissions: UpdateUserServicePermissions = req.body; // Typage explicite

    // Validation basique (optionnel : utilisez Zod ou Joi pour une validation plus robuste)
    if (!permissions || Object.keys(permissions).length === 0) {
      return res.status(400).json({ error: "No permissions provided" });
    }

    const updatedService = await userServiceService.updateUserServicePermissions(
      Number(userId),
      Number(serviceId),
      permissions // Passe directement l'objet permissions
    );

    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating user service:", error);
    res.status(500).json({ error: "Failed to update user service permissions" });
  }
};

export const revokeUserService = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.params;
    await userServiceService.deactivateUserService(Number(userId), Number(serviceId));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to revoke user service" });
  }
};
