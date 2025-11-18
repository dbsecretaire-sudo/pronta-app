// app/dashboard/Services/prontaCalls/page.tsx
"use client";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { CallStats, CallList, CallFilter } from "@/src/Components";
import { CallFilter as CallFilterType } from "@/src/lib/schemas/calls";
import { useCalls } from "@/src/Hook/useCalls";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/src/context/authContext";

export default function ConciergerieDashboard() {
  const accessToken = useContext(AuthContext);
  const { data: session } = useAuthCheck(accessToken);

  const [filter, setFilter] = useState<CallFilterType>({
      userId: 0,
      byName: "",
      byPhone: "",
    });
  const { calls, stats, loading } = useCalls(accessToken, filter);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p>Chargement des données...</p>
      </div>
    );
  }

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

        <div className="flex-1">
          <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Pronta Calls - Tableau de bord</h1>
            <CallStats {...stats} />
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Appels récents</h2>
              <CallFilter
                userId={filter.userId}
                onFilterChange={setFilter}
              />
              <CallList calls={calls} />
            </div>
          </div>
        </div>
      </div>



    
  );
}
