const API_URL = 'https://api.pronta.corsica';


export async function login(email: string, password: string): Promise<boolean> {
  console.log("Début de la fonction login avec l'email :", email); // Log de début

try {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log("Réponse de l'API :", res.status, res.ok); // Log de la réponse

  if (res.ok) {
const data = await res.json();
      console.log("Données reçues :", data); // Log des données reçues
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      return true;
    } else {
      const errorData = await res.json();
      console.log("Erreur de l'API :", errorData); // Log de l'erreur
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error); // Log de l'erreur
    return false;
  }
}

export function checkAuth(): boolean {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
