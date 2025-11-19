import { signIn } from "next-auth/react";
import Cookies from 'js-cookie';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextApiRequest } from "next";
import jwt from 'jsonwebtoken';

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}


export function logout() {
  Cookies.remove("next-auth.session-token");
  window.location.href = "/login";
}


import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";

export async function getServerToken() {
  try {
    console.log("Début de getServerToken...");

    // 1. Log des cookies disponibles
    const allCookies = (await cookies()).getAll();
    console.log("Cookies disponibles:", allCookies.map(c => `${c.name}=${c.value}`).join(", "));

    // 2. Construction de l'objet req
    const req = {
      cookies: Object.fromEntries(
        allCookies.map((cookie) => [cookie.name, cookie.value])
      ),
      headers: new Headers(),
    } as any;
    console.log("Obj req cookies:", req.cookies);

    // 3. Appel à getToken
    console.log("Appel à getToken avec secret:", authOptions.secret ? "OK" : "MISSING");
    const token = await getToken({ req, secret: authOptions.secret });

    // 4. Log du résultat de getToken
    console.log("Résultat de getToken:", token);

    // 5. Vérification de token.accessToken
    if (!token) {
      console.error("getToken a retourné null/undefined");
      return null;
    }

    if (!token.accessToken) {
      console.error("token.accessToken est manquant dans:", token);
      return null;
    }

    return token.accessToken as string;
  } catch (error) {
    console.error("Erreur dans getServerToken:", error);
    return null;
  }
}

export function verifyAndDecodeToken(token: string | null): { valid: boolean; payload?: any } {
  if(token !== null) {
    try {
      const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false };
    }
  } else {
    return { valid: false };
  }
  
  
}
