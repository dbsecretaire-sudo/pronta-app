// src/Hooks/useUser.ts
'use client';
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { useEffect, useState } from "react";
import { User } from "@/src/lib/schemas";
import { fetchUsers, fetchUsersName, fetchUsersRole, getUserById } from "../lib/api";
import { getSession } from "next-auth/react";

export type UserNameRecord = Record<number, {id: number, name: string}>;

export function useUser( accessToken: string| null, userId?: string) {
  const { data: session, status } = useAuthCheck(accessToken);

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.user.id : undefined;

    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthChecked(true);
    }
  }, [status]);

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ users, setUsers ] = useState<User[]>([]);
  const [ usersRole, setUsersRole ] = useState<User[]>([]);
  const [ usersName, setUsersName ] = useState<UserNameRecord>({});
  const [ user, setUser ] = useState<User>();

  if(userId){
    useEffect(()=> {
      const findUserById = async () => {
        const getUser = await getUserById(Number(userId), accessToken);
        setUser(getUser);
      }
      findUserById();
    }, [])
  }
  
  // Fonction pour rafraîchir les données
  const mutate = async () => {
    if (!userIdVerified) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/user/${userIdVerified}`, {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();

      // Transformation des données avec gestion des valeurs optionnelles
      const transformedData: User = {
        id: data.id,
        email: data.email,
        password_hash: data.password_hash,
        name: data.name || '',
        created_at: data.created_at ? new Date(data.created_at) : new Date(),
        billing_address: data.billing_address ? {
          street: data.billing_address.street || '',
          city: data.billing_address.city || '',
          state: data.billing_address.state || '',
          postalCode: data.billing_address.postal_code || 0,
          country: data.billing_address.country || ''
        } : undefined,
        payment_method: data.payment_method ? {
          type: data.payment_method.type || '',
          details: {
            card_number: data.payment_method.details?.card_number || '',
            card_last_four: data.payment_method.details?.card_last_four || '',
            card_brand: data.payment_method.details?.card_brand || '',
            paypal_email: data.payment_method.details?.paypal_email || '',
          },
          // default: data.payment_method.is_default || false
        } : undefined,
        // phone: data.phone || '',
        // company: data.company || '',
        role: data.role || 'user',
        can_write: data.can_write || false,
        can_delete: data.can_delete || false,
        service_ids: data.service_ids || [],
      };

      setUserData(transformedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userIdVerified) {
      mutate();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [userIdVerified]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const AllUsers = await fetchUsers(accessToken);
        const AllUsersName = await fetchUsersName(accessToken);
        const AllUsersRole = await fetchUsersRole(accessToken);
        setUsers(AllUsers);
        setUsersName(AllUsersName);
        setUsersRole(AllUsersRole);
      } catch(error) {
        setUsers([]);
        setUsersName([]);
        setUsersRole([]);
      }
    };
    fetch();
  }, [])

  return { users, usersName, usersRole, userData, loading, error, mutate, user };
}
