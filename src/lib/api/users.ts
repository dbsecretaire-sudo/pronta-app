import { Role } from "@/src/Types/Users";

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

export async function getRoleByUserId(userId: number): Promise<{ role: Role }> {
  if (!userId || typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user ID: must be a positive number');
  }

  const res = await fetch(`/api/user/${userId}/role`, {
    credentials: 'include', // ✅ Pour envoyer les cookies
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const data = await res.json();

  if (!data || typeof data.role !== 'string') {
    throw new Error('Invalid response format: missing or invalid role');
  }

  return { role: data.role as Role };
}