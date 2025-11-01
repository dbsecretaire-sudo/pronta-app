import { CreateService } from "./types";

export const validateService = (service: Partial<CreateService>): boolean => {
  return !!service.name && !!service.route;
};

export const validateUserService = (userService: any): boolean => {
  return !!userService.user_id && !!userService.service_id;
};
