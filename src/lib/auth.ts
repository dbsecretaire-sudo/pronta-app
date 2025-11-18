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
  // Créez un objet req factice avec les cookies
  const req = {
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((cookie) => [cookie.name, cookie.value])
    ),
    headers: new Headers(),
  } as any;

  const token = await getToken({ req, secret: authOptions.secret });
  return token?.accessToken as string | null;
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
