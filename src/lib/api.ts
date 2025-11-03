import { CalendarEvent } from "@/src/Types/Calendar/index";
import { CallFilter } from "@/src/Types/Calls/index"; 
import { Role } from "../Types/Users";
import { User } from "@/src/Types/Users";
import { UserService } from '@/src/Types/UserServices';
import { AvailableService } from "@/src/Types/Services";

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
    method: 'POST',
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
    method: 'POST',
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


export async function updateProfile(userId: number, data: {
  email: string;
  phone: string;
  name: string;
  role: Role;
}) {
  const response = await fetch(`/api/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Échec de la mise à jour du profil");
  }

  return response.json();
}

export async function updateBilling(userId: number, data: {
  subscription_plan?: string;
  billing_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: number;
    country: string;
  };
  payment_method?: {
    type: string;
    details: {
      card_last_four?: string;
      card_brand?: string;
      paypal_email?: string;
    };
    is_default: boolean;
  };
}) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Échec de la mise à jour des informations de facturation");
  }

  return response.json();
}


export const updateUserSubscription = async (
  userId: number,
  data: {
    plan: string;
    start_date?: string | Date;
    end_date: string | Date;
    next_payment_date: string | Date;
    status: string;
  }
) => {

  // Préparation des données pour l'API
  const requestData = {
    ...data,
    // Conversion des dates en strings ISO si elles existent
        ...(data.end_date && {
      start_date: data.start_date?.toString()
    }),
    ...(data.end_date && {
      end_date: data.end_date.toString()
    }),
    ...(data.next_payment_date && {
      next_payment_date: data.next_payment_date.toString()
    })
  };


  try {
    const res = await fetch(`/api/user/${userId}/subscription`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData), // Pas besoin de { data: ... }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Erreur de l'API:", {
        status: res.status,
        error: errorData
      });
      throw new Error(`HTTP error: ${res.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Erreur dans updateUserSubscription:", error);
    throw error;
  }
};
