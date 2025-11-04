// app/api/user-services/controller.ts
import { UserServiceService } from './service';
import {
  AssignServiceToUser,
  UpdateUserServicePermissions,
  UserServiceWithDetails,
  UserService
} from "./types";

const userServiceService = new UserServiceService();

export const getUserServices = async (userId: number): Promise<UserServiceWithDetails[]> => {
  return await userServiceService.getUserServices(userId);
};

export const createUserService = async (userServiceData: UserService) => {
  return await userServiceService.createUserService(userServiceData);
}

export const getUserService = async (
  userId: number,
  serviceId: number
): Promise<UserServiceWithDetails> => {
  const userService = await userServiceService.getUserService(userId, serviceId);
  if (!userService) {
    throw new Error("User service not found");
  }
  return userService;
};

export const assignServiceToUser = async (data: AssignServiceToUser): Promise<UserService> => {
  return await userServiceService.assignServiceToUser(data);
};

export const updateUserServicePermissions = async (
  userId: number,
  serviceId: number,
  permissions: UpdateUserServicePermissions
): Promise<UserService> => {
  return await userServiceService.updateUserServicePermissions(userId, serviceId, permissions);
};

export const deactivateUserService = async (
  userId: number,
  serviceId: number
): Promise<UserService> => {
  return await userServiceService.deactivateUserService(userId, serviceId);
};

export const reactivateUserService = async (
  userId: number,
  serviceId: number
): Promise<UserService> => {
  return await userServiceService.reactivateUserService(userId, serviceId);
};
