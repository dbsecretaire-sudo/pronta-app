// app/api/user/controller.ts
import { UserService } from './service'; // Adaptez le chemin

const userService = new UserService();

export const getAllUsers = async () => {
  return await userService.getAllUsers();
};

export const getUserById = async (id: number) => {
  const user = await userService.getUserById(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const createUser = async (userData: any) => {
  return await userService.createUser(userData);
};

export const updateUser = async (id: number, userData: any) => {
  return await userService.updateUser(id, userData);
};

export const deleteUser = async (id: number) => {
  return await userService.deleteUser(id);
};

export const getUsersBySubscriptionPlan = async (plan: string) => {
  return await userService.getUsersBySubscriptionPlan(plan);
};

export const updateUserSubscription = async (id: number, plan: string, userData: any) => {
  return await userService.updateUserSubscription(id, plan, userData);
}

