import { Request, Response } from "express";
import { UserService } from "./service";
import { Role } from "./types";

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, searchTerm, subscriptionPlan, subscriptionActive } = req.query;
    const users = await userService.getAllUsers({
      role: role as Role | undefined,
      searchTerm: searchTerm as string | undefined,
      subscriptionPlan: subscriptionPlan as string | undefined,
      subscriptionActive: subscriptionActive === 'true',
    });
    const usersWithoutPassword = users.map(({ password_hash, ...user }) => user);
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(Number(id));
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const emailExists = await userService.checkEmailExists(user.email);
    if (emailExists) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const newUser = await userService.createUser(user);
    const { password_hash, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.body;
    const updatedUser = await userService.updateUser(Number(id), user);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getUsersBySubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { plan } = req.params;
    const users = await userService.getUsersBySubscriptionPlan(plan);
    const usersWithoutPassword = users.map(({ password_hash, ...user }) => user);
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users by subscription plan" });
  }
};
