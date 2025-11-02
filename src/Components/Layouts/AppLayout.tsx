// src/components/layouts/AppLayout.tsx (version optimisée)
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
    <>
      {showNavbar && (
        <NavBar
          showLogo={true}
          logoText="Pronta"
          isInService={isInService}
          userServices={userServices}
        />
      )}
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}
