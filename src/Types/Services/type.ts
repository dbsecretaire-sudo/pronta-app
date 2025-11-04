import { UserService } from "@/src/Types/UserServices/index";

export interface Service {
  id: number;
  name: string;
  description: string | null;
  route: string;
  icon: string | null;
  price: number;
  unit: string;
}

export type CreateService = Omit<Service, "id">;

export interface AvailableService extends Service {
  isSubscribed: boolean;
  userService?: UserService;
}

export interface SubscriptionRequest {
  serviceId: number; // Typage du corps de la requête
}