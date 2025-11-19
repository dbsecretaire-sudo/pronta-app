// src/Hook/useAuthCheck.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../lib/schemas';
import { Session } from 'next-auth';
import { UserWithServices } from '../lib/schemas/users';
import { getUserById } from '../lib/api';

interface UserData extends Session {
    [key: string]: any;
}

export const useAuthCheck = (accessToken: {} | string| null) => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserData | null>(null);
  const [user, setUser] = useState<UserWithServices | null>(null);
  const router = useRouter();

useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session', {credentials: "include"});
      if (!response.ok) {
        setStatus("unauthenticated");
        setData(null);
        setUser(null);
        return;
      }
      const data = await response.json();
      if (data) {
        setStatus("authenticated");
        setData(data);

        // Version corrigée pour récupérer les données utilisateur
        try {
          const userData = await getUserById(data.user.id, accessToken); // Attendre la résolution de la promesse
          setUser(userData);
        } catch (error) {
          setUser(data.user); // Utiliser les données de base en cas d'erreur
        }
      } else {
        setStatus("unauthenticated");
        setData(null);
        setUser(null);
      }
    } catch (error) {
      setStatus("unauthenticated"); // Correction de la faute de frappe "unathenticated" -> "unauthenticated"
      setData(null);
      setUser(null);
      setError("Erreur lors de la vérification de l'authentification");
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [router]);


  return { status, loading, error, data, user };
};