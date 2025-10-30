// hooks/useAuth.ts
"use client";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, []);
}

export function useRedirectIfLoggedIn() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);
}

export function useRedirectBasedOnAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);
}