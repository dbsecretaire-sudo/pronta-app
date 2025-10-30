"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/app/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (checkAuth()) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, []);

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
