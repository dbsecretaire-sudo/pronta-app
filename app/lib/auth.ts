export async function login(email: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return false;
  }
}

export function checkAuth(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}