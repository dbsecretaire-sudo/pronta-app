"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="flex h-screen">
      {/* Menu mobile (burger) */}
      {isMobile && (
        <nav className="bg-white shadow-sm w-full z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Pronta Calls</span>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Menu mobile déroulant + overlay semi-transparent */}
      {isMobile && isOpen && (
        <>
          {/* Overlay semi-transparent (noir à 30% d'opacité) */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu déroulant (z-index plus élevé que l'overlay) */}
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-4">
            <Link
              href="/dashboard"
              className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
              onClick={() => setIsOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/calls"
              className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
              onClick={() => setIsOpen(false)}
            >
              Appels
            </Link>
            <Link
              href="/dashboard/calendar"
              className="block py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200"
              onClick={() => setIsOpen(false)}
            >
              Agenda
            </Link>
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
      {!isMobile && (
        <div className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20">
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Pronta Calls
            </Link>
          </div>
          <div className="flex-1 p-4">
            <Link
              href="/dashboard"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2"
            >
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/calls"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2"
            >
              Appels
            </Link>
            <Link
              href="/dashboard/calendar"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded px-2"
            >
              Agenda
            </Link>
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
      <div className={`flex-1 ${isMobile ? "w-full" : "ml-64"} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
