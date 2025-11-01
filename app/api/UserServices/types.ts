export type { 
  UserService, 
  UserServiceWithDetails, 
  AssignServiceToUser, 
  UpdateUserServicePermissions ,
  CreateUserService,
  UpdateUserService
} from "@/app/Types/UserServices/index";
import { AssignServiceToUser } from "@/app/Types/UserServices/index";

export const validateUserServiceAssignment = (data: AssignServiceToUser): boolean => {
  return !!data.user_id && !!data.service_id;
};