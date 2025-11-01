import { AssignServiceToUser } from "@/app/Types/UserServices/index";

export const validateUserServiceAssignment = (data: AssignServiceToUser): boolean => {
  return !!data.user_id && !!data.service_id;
};