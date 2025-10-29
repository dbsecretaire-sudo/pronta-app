const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;


import Cookies from 'js-cookie';

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      Cookies.set("token", token, { expires: 1 }); // Stocke le token dans un cookie
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return false;
  }
}

export function checkAuth(): boolean {
  return !!Cookies.get("token");
}

export function logout() {
  Cookies.remove("token");
}
