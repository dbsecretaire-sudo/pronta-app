// src/components/layouts/AppLayout.tsx
"use client";
import { ReactNode } from "react";
import { NavBar } from "@/src/Components";
import { useAppLayout } from "@/src/Hook/useAppLayout";

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  requireAuth?: boolean;
}

export function AppLayout({
  children,
  showNavbar = true,
  requireAuth = true
}: AppLayoutProps) {
  const {
    status,
    isInService,
    userServices,
    servicesLoading
  } = useAppLayout();

  // États de chargement
  if (requireAuth && status === "loading") {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (requireAuth && status === "unauthenticated") {
    return null;
  }

  if (servicesLoading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barre de navigation */}
      {showNavbar && !isInService && (
        <NavBar
          showLogo={true}
          logoText="Pronta"
          isInService={isInService}
          userServices={userServices}
        />
      )}

      {/* Contenu principal avec marge si navbar est affichée */}
      <main className={`flex-1 ${showNavbar && !isInService ? 'md:ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}
