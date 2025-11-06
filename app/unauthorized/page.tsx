// src/app/unauthorized/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SignOutButton } from "@/src/Components/SignOutButton"; // À créer
import Link from "next/link";

export default async function UnauthorizedPage() {
  const session = await getServerSession(authOptions);
  console.log(session?.user.role);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
        <p className="text-gray-700 mb-6">
          Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retour à l&apos;accueil
          </Link>
          {session && (
            <SignOutButton>
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                Se déconnecter
              </button>
            </SignOutButton>
          )}
        </div>
      </div>
    </div>
  );
}
