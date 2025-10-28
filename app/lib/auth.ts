export async function login(email: string, password: string): Promise<boolean> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) {
    const { token } = await res.json();
    localStorage.setItem("token", token);
    return true;
  }
  return false;
}

export function checkAuth(): boolean {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
