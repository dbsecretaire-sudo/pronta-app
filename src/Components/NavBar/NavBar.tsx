"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { NavbarProps } from "./NavBar.types";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { getUserById } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function Navbar({
  children,
  showLogo = true,
  logoText = "Pronta",
  isInService = false,
  userServices = [], // Services par défaut vide
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useAuthCheck();
  const pathname = usePathname();
  const [ isAdmin, setIsAdmin ] = useState(false);
  const router = useRouter();

  // Menu principal (fixe)
  const mainMenuItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: "📊" },
    { name: "Mon compte", path: "/dashboard/account", icon: "👤" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Utilise `status` pour vérifier l'authentification
  if (status === "unauthenticated") return null;
  if (status === "loading") return null;

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!session?.user.id) {
        setIsAdmin(false);
        return;
      }
      try {
        const user = await getUserById(Number(session.user.id));
        setIsAdmin(user.role === 'ADMIN');
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle :", error);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [session?.user.id]);
  
  const handleAdmin = () => {
    router.push('/admin');
  };
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Menu mobile
  const MobileMenu = () => (
    <>
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

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4">
            {showLogo && (
              <div className="border-b border-gray-200 pb-4 mb-4">
                <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                  {logoText}
                </Link>
              </div>
            )}

            {/* Menu principal */}
            <div className="mb-4">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Services souscrits */}
            {userServices.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Mes services</h3>
                {userServices.map((service) => (
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
              </div>
            )}

            {isAdmin && (
              <button
                onClick={handleAdmin}
                className="mt-auto block py-2 text-gray-600 hover:text-gray-900 text-left w-full"
              >
                Administration
              </button>
            )}

            <button
              onClick={handleLogout}
              className="mt-auto block py-2 text-gray-600 hover:text-gray-900 text-left w-full"
            >
              Déconnexion
            </button>
          </div>
        </>
      )}
    </>
  );

  // Menu desktop
  const DesktopMenu = () => (
    <div className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20">
      {showLogo && (
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            {logoText}
          </Link>
        </div>
      )}

      <div className="flex-1 p-4">
        {/* Menu principal */}
        <div className="mb-6">
          {mainMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2 mb-1 ${
                pathname === item.path ? 'bg-gray-100' : ''
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Services souscrits */}
        {userServices.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Mes services
            </h3>
            {userServices.map((service) => (
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

        {isAdmin && (
          <button
            onClick={handleAdmin}
            className="mt-auto block py-2 text-gray-600 hover:text-gray-900 text-left w-full"
          >
            Administration
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full text-left py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Menu mobile */}
      {isMobile && <MobileMenu />}

      {/* Menu desktop */}
      {!isMobile && !isInService && <DesktopMenu />}

      {/* Contenu principal */}
      <div className={`flex-1 ${isMobile ? 'w-full' : isInService ? 'w-full' : 'ml-64'} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
