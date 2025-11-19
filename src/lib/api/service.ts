import { Service } from "@/src/lib/schemas/services";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllServices = async (accessToken: string | null):Promise<Service[]> => {
  const res = await fetch(`${API_URL}/api/services`, { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const fetchUserServices = async (userId: number, accessToken: string | null) => {

  const res = await fetch(`${API_URL}/api/user/${userId}/service`, { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};



export const subscribeToService = async (userId: number, serviceId: number, accessToken: string | null): Promise<void> => {

  const res = await fetch(`${API_URL}/api/user/${userId}/${serviceId}/reactivate`, {
    method: 'POST', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const deactivateUserService = async (userId: number, serviceId: number, accessToken: string | null): Promise<void> => {

  const response = await fetch(`${API_URL}/api/user/${userId}/${serviceId}/deactivate`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
  }
};

export const reactivateUserService = async (userId: number, serviceId: number, accessToken: string | null): Promise<void> => {

  const response = await fetch(`${API_URL}/api/user/${userId}/${serviceId}/reactivate`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
  }
};

export const createService = async (serviceData: Omit<Service, 'id'>, accessToken: string| null): Promise<Service> => {

  const response = await fetch(`${API_URL}/api/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    },
    credentials: "include",
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Échec de la création du service: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
};