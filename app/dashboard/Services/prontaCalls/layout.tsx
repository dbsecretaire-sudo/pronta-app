"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ProntaCallsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen">
      {/* Barre de retour spécifique à ProntaCalls */}
      <nav className="bg-white border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center transition-colors"
            >
              ← Retour au tableau de bord
            </Link>
            <div className="text-xl font-semibold text-gray-800">
              Pronta Calls
            </div>
          </div>
        </div>
      </nav>

      {/* Le contenu sera enveloppé par AppLayout qui gère la navbar globale */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
