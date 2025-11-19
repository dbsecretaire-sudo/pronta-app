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

export async function getServerToken() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    const req = {
      cookies: {
        "next-auth.session-token": sessionToken, // Passez uniquement le cookie nécessaire
      },
      headers: {
        host: process.env.NEXTAUTH_URL || "fr.pronta.corsica",
        "x-forwarded-proto": "https",
      },
    } as any;

    const token = await getToken({ req, secret: authOptions.secret });

    if (!token) {
      return null;
    }

    return token.accessToken as string | null;
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
