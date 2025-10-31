export type { UserService, UserServiceWithDetails, AssignServiceToUser, UpdateUserServicePermissions } from "@/Types/UserServices/index";
import { AssignServiceToUser } from "@/Types/UserServices/index";

export const validateUserServiceAssignment = (data: AssignServiceToUser): boolean => {
  return !!data.user_id && !!data.service_id;
};