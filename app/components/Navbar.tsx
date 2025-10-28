"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">Pronta Calls</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/calls" className="text-gray-600 hover:text-gray-900">
              Appels
            </Link>
            <Link href="/dashboard/calendar" className="text-gray-600 hover:text-gray-900">
              Agenda
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
