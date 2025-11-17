"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/lib/auth";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");     // Champ vide par défaut
  const [password, setPassword] = useState(""); // Champ vide par défaut
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

// Récupérer le jeton CSRF au chargement du composant
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/auth/csrf', {credentials: 'include'});
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Erreur lors de la récupération du jeton CSRF:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        csrfToken,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/dashboard`);
      }
    } catch (error) {
      setError("Erreur lors de la connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            autoComplete="username"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Se connecter
        </button>
      </form>
    </div>
  );
}
