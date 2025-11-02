// src/Hooks/useUser.ts
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@/src/Types/Users"; // Assurez-vous que ce chemin est correct

export function useUser() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour rafraîchir les données
  const mutate = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user/${session.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();

      // Transformation des données pour correspondre à notre interface User
      const transformedData: User = {
        id: data.id,
        email: data.email,
        password_hash: data.password_hash,
        name: data.name || undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        billing_address: data.billing_address ? {
          street: data.billing_address.street,
          city: data.billing_address.city,
          state: data.billing_address.state || '',
          postal_code: data.billing_address.postal_code,
          country: data.billing_address.country
        } : undefined,
        payment_method: data.payment_method ? {
          type: data.payment_method.type,
          details: {
            card_last_four: data.payment_method.details?.card_last_four,
            card_brand: data.payment_method.details?.card_brand,
            paypal_email: data.payment_method.details?.paypal_email,
          },
          is_default: data.payment_method.is_default || false
        } : undefined,
        subscription_plan: data.subscription_plan || undefined,
        subscription_end_date: data.subscription_end_date ? new Date(data.subscription_end_date) : undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        next_payment_date: data.next_payment_date ? new Date(data.next_payment_date) : undefined,
        subscription_status: data.subscription_status || undefined,
        role: data.role,
        // Ajoutez messages si nécessaire (devrait venir d'une autre table)
        // messages: data.messages || []
      };

      setUserData(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      mutate();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [session?.user?.id]);

  return { userData, loading, error, mutate };
}
