import { AvailableService, Service } from "@/src/Types/Services";
import { UserService } from '@/src/Types/UserServices';

export const fetchAllServices = async () => {
  const res = await fetch('/api/services', { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const fetchUserServices = async (userId: number) => {
  const res = await fetch(`/api/UserServices/${userId}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const subscribeToService = async (userServiceData: UserService): Promise<void> => {
  const res = await fetch('/api/UserServices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userServiceData),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const deactivateUserService = async (userId: number, serviceId: number): Promise<void> => {
  const response = await fetch(`/api/UserServices/${userId}/${serviceId}/deactivate`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
  }
};

export const reactivateUserService = async (userId: number, serviceId: number): Promise<void> => {
  const response = await fetch(`/api/UserServices/${userId}/${serviceId}/reactivate`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
  }
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Échec de la création du service: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
};