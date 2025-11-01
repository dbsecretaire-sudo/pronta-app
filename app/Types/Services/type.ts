export interface Service {
  id: number;
  name: string;
  description: string | null;
  route: string;
  icon: string | null;
}

export type CreateService = Omit<Service, "id">;

export interface AvailableService {
  id: number;
  name: string;
  description: string;
  route: string;
  icon: string;
  isSubscribed: boolean;
}

export interface SubscriptionRequest {
  serviceId: number; // Typage du corps de la requête
}