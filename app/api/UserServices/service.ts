import {
  UserServiceModel,
  UserService,
  UserServiceWithDetails,
  AssignServiceToUser,
  UpdateUserServicePermissions
} from "./types";
import { validateUserServiceAssignment } from "./utils";

export class UserServiceService {
  private userServiceModel = new UserServiceModel({} as UserService);

  async getUserServices(userId: number): Promise<UserServiceWithDetails[]> {
    return this.userServiceModel.getUserServices(userId);
  }

  async getUserService(userId: number, serviceId: number): Promise<UserServiceWithDetails | null> {
    return this.userServiceModel.getUserService(userId, serviceId);
  }

  async assignServiceToUser(data: AssignServiceToUser): Promise<UserService> {
    if (!validateUserServiceAssignment(data)) {
      throw new Error("user_id and service_id are required");
    }
    return this.userServiceModel.assignServiceToUser(data);
  }

  async updateUserServicePermissions(
    userId: number,
    serviceId: number,
    permissions: UpdateUserServicePermissions
  ): Promise<UserService> {
    return this.userServiceModel.updateUserService(userId, serviceId, permissions);
  }

  async deactivateUserService(userId: number, serviceId: number): Promise<UserService> {
    return this.userServiceModel.deactivateUserService(userId, serviceId);
  }

  async reactivateUserService(userId: number, serviceId: number): Promise<UserService> {
    return this.userServiceModel.reactivateUserService(userId, serviceId);
  }
}
