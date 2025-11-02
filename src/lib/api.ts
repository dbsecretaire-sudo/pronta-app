import { CalendarEvent } from "@/src/Types/Calendar/index";
import { CallFilter } from "@/src/Types/Calls/index"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Remplacez par l’URL de votre backend

export async function fetchCalls(filter: CallFilter) {
  // Construisez l'URL avec tous les paramètres de filtre
  const queryParams = new URLSearchParams();

  // Ajoutez userId seulement s'il est défini
  if (filter.userId) {
    queryParams.append('userId', filter.userId.toString());
  }

  // Ajoutez les autres filtres seulement s'ils sont définis
  if (filter.byName) {
    queryParams.append('byName', filter.byName);
  }

  if (filter.byPhone) {
    queryParams.append('byPhone', filter.byPhone);
  }

  // Construisez l'URL complète
  const url = `${API_URL}/api/calls?${queryParams.toString()}`;

  const res = await fetch(url);
  return res.json();
}

export async function fetchCalendar(): Promise<CalendarEvent[]> {

  const url = `${API_URL}/api/calendar`;
  const res = await fetch(url);
  return res.json();
}

export const fetchUserServices = async (userId: number) => {
  const res = await fetch(`/api/UserServices/${userId}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const fetchAllServices = async () => {
  const res = await fetch('/api/services', { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const subscribeToService = async (serviceId: number) => {
  const res = await fetch('/api/user/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ serviceId }),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const deactivateUserService = async (userId: number, serviceId: number): Promise<void> => {
    const response = await fetch(`/api/UserServices/${userId}/${serviceId}/deactivate`, {
    method: 'PATCH',
    credentials: 'include', // Pour les cookies d'authentification
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
  } else {
    const result = await response.json();
    console.log(`Service désactivé: userId: ${userId}, serviceId: ${serviceId}`, result);
  }
};

export const reactivateUserService = async (userId: number, serviceId: number): Promise<void> => {
    const response = await fetch(`/api/UserServices/${userId}/${serviceId}/reactivate`, {
    method: 'PACTH',
    credentials: 'include', // Pour les cookies d'authentification
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error.error);
  } else {
    const result = await response.json();
    console.log(`Service réactivé: userId: ${userId}, serviceId: ${serviceId}`, result);
  }
};
