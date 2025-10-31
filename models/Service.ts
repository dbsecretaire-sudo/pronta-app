export interface Service {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
}

export interface AvailableService {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  isSubscribed: boolean;
}

export interface SubscriptionRequest {
  serviceId: string; // Typage du corps de la requête
}