"use client";
import { usePathname } from "next/navigation";
import { NavBar } from "@/src/Components";

export default function ProntaInvoicesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Tableau de bord",
      path: "/dashboard/Services/prontaInvoices",
      icon: "📊"
    },
    {
      name: "Factures",
      path: "/dashboard/Services/prontaInvoices/invoices",
      icon: "📄"
    },
    {
      name: "Clients",
      path: "/dashboard/Services/prontaInvoices/clients",
      icon: "👥"
    }
  ];

  return (
    <>
      {/* Barre de retour */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              ← Retour au tableau de bord
            </a>
          </div>
        </div>
      </nav>

      {/* Navbar partagé */}
      <NavBar
        navItems={navItems}
        showLogo={false}
        isInService={true}
        logoText="Pronta Invoices"
      >
        <div className="p-6 bg-gray-50 min-h-screen">
          {children}
        </div>
      </NavBar>
    </>
  );
}
