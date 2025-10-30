"use client";
import { useRedirectIfLoggedIn } from "@/app/hook/useAuth";

export default function Home() {
  useRedirectIfLoggedIn();

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
