import { signIn } from "next-auth/react";
import Cookies from 'js-cookie';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextApiRequest } from "next";
import jwt, { verify, JwtPayload } from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
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

export async function getServerToken(): Promise<string | null> {
  try {
    const allCookies = (await cookies()).getAll();

    const req = {
      cookies: Object.fromEntries(allCookies.map((cookie) => [cookie.name, cookie.value])),
      headers: new Headers(),
    } as any;
console.log('req ', req)
    // Utilisez getToken pour déchiffrer le token NextAuth
    const token = await getToken({ req, secret: authOptions.secret });
    console.log('token : req : ',req, " secret : ",  authOptions.secret, " resultat: ", token)
    if (!token) {
      return null;
    }

    // Si vous avez un accessToken personnalisé dans le token NextAuth
    if (token.accessToken) {
      // Vérifiez si accessToken est une chaîne ou un objet
      let safeToken: string;
      if (typeof token.accessToken === "string") {
        safeToken = token.accessToken;
      } else {
        return null;
      }

      return safeToken;
    }

    // Si vous n'avez pas d'accessToken personnalisé, retournez le token NextAuth lui-même
    // (mais attention, il n'est pas au format JWT standard)
    return token.toString();
  } catch (error) {
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
