"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (!response.ok || !data.user) {
          // Si la session est vide ou invalide, rediriger vers /login
          router.push('/login');
        } else {
          // Si l'utilisateur est connecté, rediriger vers /dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Redirection en cours...</h1>
        </div>
      </main>
    </div>
  );
}
