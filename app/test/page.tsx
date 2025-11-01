"use client";
import { useSession } from "next-auth/react";

export default function TestMinimal() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Chargement...</div>;
  if (!session) return <div>Non connecté</div>;

  return (
    <div>
      <h1>Session valide</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}