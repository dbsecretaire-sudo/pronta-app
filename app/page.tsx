"use client";
import { AuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const session = useContext(AuthContext);
  const router = useRouter();

useEffect(() => {
  if(session === null){
    router.push(`/login`);
  } else {
    router.push(`/dashboard`);
  }
}, [session]);

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
