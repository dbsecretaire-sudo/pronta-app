"use client";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { useEffect } from "react";

export default function ProntaCallsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation spécifique à ProntaCalls
  const navItems = [
    {
      name: "Tableau de bord",
      path: "/dashboard/Services/prontaCalls",
      icon: "📊"
    },
    {
      name: "Appels",
      path: "/dashboard/Services/prontaCalls/calls",
      icon: "📞"
    },
    {
      name: "Calendrier",
      path: "/dashboard/Services/prontaCalls/calendar",
      icon: "📅"
    }
  ];

  return (
    <>
      {/* Barre de navigation spécifique à ProntaCalls (pour le retour) */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a
                href="/dashboard"
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                ← Retour au tableau de bord
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Utilisation du Navbar partagé avec configuration spécifique */}
      <Navbar
        navItems={navItems}
        showLogo={false}  // On masque le logo car on a déjà la barre de retour
        isInService={true}  // Indique qu'on est dans un service spécifique
        logoText="Pronta Calls"  // Texte alternatif si besoin
      >
        {/* Conteneur pour le contenu principal avec padding */}
        <div className="p-6 bg-gray-50 min-h-screen">
          {children}
        </div>
      </Navbar>
    </>
  );
}
