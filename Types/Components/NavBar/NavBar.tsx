"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { NavbarProps } from "./NavBar.types"; // ✅ Import local

export default function Navbar({
  children,
  navItems,
  showLogo = true,
  logoText = "Pronta",
  isInService = false,
  services = [],
  showServicesSection = true,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession(); // ✅ Utilise useSession
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Utilise `status` pour vérifier l'authentification
  if (status === "unauthenticated") return null;
  if (status === "loading") return null; // Optionnel : affiche un loader

  // ✅ Fonction de déconnexion avec NextAuth
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // ✅ Utilise signOut de NextAuth
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Menu mobile */}
      {isMobile && (
        <nav className="bg-white shadow-sm w-full z-30">
          <div className="w-full px-4">
            <div className="flex justify-between h-16 items-center">
              {showLogo && (
                <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-gray-900">{logoText}</span>
                </Link>
              )}
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

      {/* Menu mobile déroulant */}
      {isMobile && isOpen && !isInService && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            ))}

            {showServicesSection && services.length > 0 && (
              <>
                <div className="mb-2 mt-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Mes services</h3>
                </div>
                {services.map((service) => (
                  <Link
                    key={service.path}
                    href={service.path}
                    className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {typeof service.icon === 'string' ? (
                      <span className="mr-2">{service.icon}</span>
                    ) : (
                      <span className="mr-2">{service.icon}</span>
                    )}
                    {service.name}
                  </Link>
                ))}
              </>
            )}

            <button
              onClick={handleLogout}
              className="mt-auto block py-2 text-gray-600 hover:text-gray-900 text-left"
            >
              Déconnexion
            </button>
          </div>
        </>
      )}

      {/* Menu latéral desktop */}
      {!isMobile && !isInService && (
        <div className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20">
          {showLogo && (
            <div className="p-4 border-b border-gray-200">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                {logoText}
              </Link>
            </div>
          )}

          <div className="flex-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2 mb-1 ${
                  pathname === item.path ? 'bg-gray-100' : ''
                }`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            ))}

            {showServicesSection && services.length > 0 && (
              <div className="mb-4 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Mes services
                </h3>
                {services.map((service) => (
                  <Link
                    key={service.path}
                    href={service.path}
                    className={`block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2 mb-1 ${
                      pathname.startsWith(service.path) ? 'bg-gray-100' : ''
                    }`}
                  >
                    {typeof service.icon === 'string' ? (
                      <span className="mr-2">{service.icon}</span>
                    ) : (
                      <span className="mr-2">{service.icon}</span>
                    )}
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2"
            >
              Déconnexion
            </button>
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
