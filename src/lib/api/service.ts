import { AvailableService, Service } from "@/src/Types/Services";
import { UserService, UserServiceWithDetails } from '@/src/Types/UserServices';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllServices = async ():Promise<Service[]> => {
  const res = await fetch(`${API_URL}/api/services`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const fetchUserServices = async (userId: number) => {
  const res = await fetch(`/api/UserServices/${userId}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const fetchAllUserServices = async (): Promise<UserServiceWithDetails[]> => {
  const res = await fetch(`${API_URL}/api/UserServices`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

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