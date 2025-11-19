import { signIn } from "next-auth/react";
import Cookies from 'js-cookie';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextApiRequest } from "next";
import jwt, { verify, JwtPayload } from 'jsonwebtoken';
import { getToken, JWT } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { Role } from "../Types/Users";

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

export async function getServerTokenBis(): Promise<JWT | string | null> {
  const cookieStore = cookies();
  const req = {
    cookies: Object.fromEntries(
      (await cookieStore).getAll().map((cookie) => [cookie.name, cookie.value])
    ),
    headers: {
      host: "fr.pronta.corsica",
      "x-forwarded-proto": "https",
    },
  } as any;

  return await getToken({ req, secret: authOptions.secret });
}

export async function getServerToken(): Promise<string | null> {
  try {
    // 1. Récupérez les cookies avec `cookies()`
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // 2. Construisez l'objet `req` attendu par `getToken`
    const req = {
      cookies: Object.fromEntries(
        allCookies.map((cookie) => [cookie.name, cookie.value])
      ),
      headers: {
        host: "fr.pronta.corsica",
        "x-forwarded-proto": "https",
      },
    } as any;

    // 3. Utilisez `getToken` pour déchiffrer le token NextAuth
    const token = await getToken({ req, secret: authOptions.secret });

    if (!token) {
      console.error("Aucun token trouvé");
      return null;
    }

    // 4. Si vous avez un `accessToken` personnalisé, retournez-le
    if (typeof token.accessToken === "string") {
      return token.accessToken;
    }

    // 5. Sinon, retournez `null` (le token NextAuth n'est pas un JWT standard)
    console.warn("Aucun accessToken personnalisé trouvé");
    return null;
  } catch (error) {
    console.error("Erreur dans getServerToken:", error);
    return null;
  }
}


export function verifyAndDecodeToken(token: string | null): { valid: boolean; payload?: any } {
  if(token !== null) {
    try {
      if (!token) {
        return { valid: false };
      }

      try{
        verify(token, process.env.NEXTAUTH_SECRET!)
      } catch(error) {console.error(error)}
      const payload = verify(token, process.env.NEXTAUTH_SECRET!) as JwtPayload;
     
      return { valid: true, payload };
    } catch (error) {
      return { valid: false };
    }
  } else {
    return { valid: false };
  }
}
