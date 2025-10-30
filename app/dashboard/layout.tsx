"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Détecter si on est dans un service spécifique
  const isInService = pathname.includes('/dashboard/Services/');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Services disponibles
  const services = [
    {
      name: "Pronta Calls",
      path: "/dashboard/Services/prontaCalls",
      icon: "📞"
    }
    // Ajoutez d'autres services ici
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Menu mobile */}
      {isMobile && (
        <nav className="bg-white shadow-sm w-full z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Pronta</span>
              </Link>
              {!isInService && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
        </nav>
        )}
      {isMobile && isOpen && !isInService && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4">
            <div className="mb-6">
              <Link
                href="/dashboard"
                className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Tableau de bord
              </Link>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Mes services</h3>
              {services.map((service) => (
                <Link
                  key={service.path}
                  href={service.path}
                  className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  {service.icon} {service.name}
                </Link>
              ))}
            </div>
            <div>
              <Link
                href="/dashboard/account"
                className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Mon compte
              </Link>
              <button
                onClick={handleLogout}
                className="mt-4 w-full text-left py-2 text-gray-600 hover:text-gray-900"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}

      {/* Menu latéral desktop */}
      {!isMobile && !isInService && (
        <div className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20">
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Pronta
            </Link>
          </div>
          <div className="flex-1 p-4">
            <Link
              href="/dashboard"
              className={`block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2 mb-2 ${
                pathname === '/dashboard' ? 'bg-gray-100' : ''
              }`}
            >
              Tableau de bord
            </Link>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Services</h3>
              {services.map((service) => (
                <Link
                  key={service.path}
                  href={service.path}
                  className={`block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2 mb-1 ${
                    pathname.startsWith(service.path) ? 'bg-gray-100' : ''
                  }`}
                >
                  {service.icon} {service.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <Link
                href="/dashboard/account"
                className={`block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2 ${
                  pathname.startsWith('/dashboard/account') ? 'bg-gray-100' : ''
                }`}
              >
                Mon compte
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className={`flex-1 ${isMobile ? 'w-full' : isInService ? 'w-full' : 'ml-64'} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
