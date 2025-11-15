import { signIn } from "next-auth/react";
import Cookies from 'js-cookie';

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
