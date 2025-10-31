export interface Service {
  id: number;
  name: string;
  description: string | null;
  route: string;
  icon: string | null;
}

export type CreateService = Omit<Service, "id">;