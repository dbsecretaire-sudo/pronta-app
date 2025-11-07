import { Role } from "@/src/Types/Users";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateProfile(userId: number, data: {
  email: string;
  phone: string;
  name: string;
  role: Role;
}) {
  const response = await fetch(`/api/user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Échec de la mise à jour des informations de facturation");
  return response.json();
}

export async function getRoleByUserId(userId: number){
  const res = await fetch(`${API_URL}/api/user/${userId}/role`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export const fetchUsers = async () => {
    const res = await fetch(`/api/user`, {credentials : 'include'});
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
}

export const fetchUsersRole = async () => {
    const res = await fetch(`${API_URL}/api/user/role`, {credentials : 'include'});
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
}


export const fetchUsersForAdmin = async () => {
    const res = await fetch(`${API_URL}/api/user/role`, {credentials : 'include'});
    const users = await res.json();
     
    return users.reduce((acc: Record<number, any>, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});

}

export const fetchUsersName = async () => {
    const res = await fetch(`${API_URL}/api/user/name`, {credentials : 'include'});
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
}
