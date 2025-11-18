import { Role } from "@/src/Types/Users";
import { User } from '@/src/lib/schemas'
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUser = async (userId: number) => {
  const currentSession = await getSession();
  if (!currentSession) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }
  const res = await fetch(`${API_URL}/api/user/${userId}`, { 
    credentials: 'include',
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
    },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export async function updateProfile(userId: number, data: {
  email: string;
  phone: string;
  name: string;
  role: Role;
}) {
  const currentSession = await getSession();
  if (!currentSession) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }
  const response = await fetch(`/api/user/${userId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Échec de la mise à jour du profil");
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
    details: { card_number?: string; card_last_four?: string; card_brand?: string; paypal_email?: string };
    is_default: boolean;
  };
}) {
  const currentSession = await getSession();
  if (!currentSession) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Échec de la mise à jour des informations de facturation");
  return response.json();
}

export async function getRoleByUserId(userId: number){
  const currentSession = await getSession();
  if (!currentSession) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }
  const res = await fetch(`${API_URL}/api/user/${userId}/role`, { 
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
    },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export const fetchUsers = async (accessToken: string | null):Promise<User[]> => {
  const res = await fetch(`${API_URL}/api/user`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
      },
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
}


export const fetchUsersRole = async (accessToken: string | null) => {

    const res = await fetch(`${API_URL}/api/user/role`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
      },
    });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}


export const fetchUsersForAdmin = async () => {
    const currentSession = await getSession();
    if (!currentSession) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    const res = await fetch(`${API_URL}/api/user/role`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
      },
    });
    const users = await res.json();
     
    return users.reduce((acc: Record<number, any>, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});

}

export const fetchUsersName = async (accessToken: string | null) : Promise<Record<number, User>> => {

    const res = await fetch(`${API_URL}/api/user/name`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
      },
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
}

export const getUserById = async (userId: number) : Promise<User> => {
    const currentSession = await getSession();
    if (!currentSession) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    const res = await fetch(`${API_URL}/api/user/${userId}`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
      },
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
}
