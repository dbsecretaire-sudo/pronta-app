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


export async function getSecureToken() {
  const session = await getServerSession(authOptions);
  // @ts-ignore (accès interne à NextAuth)
  const token = await getToken({ req: undefined, secret: authOptions.secret });
  return token?.accessToken;
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
