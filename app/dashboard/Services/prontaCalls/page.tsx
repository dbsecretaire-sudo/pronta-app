"use client";
import { CallStats, CallList, CallFilter, Calendar } from "@/src/Components";
import { useCalls } from "@/src/Hook/useCalls";
import { Tabs } from "@/src/Components"; // À créer ou utiliser une lib comme @radix-ui/react-tabs
import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/src/context/authContext";

export default function ProntaCallsDashboard() {
    const context = useContext(AuthContext)
  const { accessToken, session } = context;
  const { calls, stats, calendarEvents, loading, handleFilterChange } = useCalls(accessToken);

  const tabs = [
    {
      id: "calls",
      label: "Appels récents",
      content: (
        <div className="bg-white p-6 rounded-lg shadow">
          <CallFilter
            userId={Number(session?.user.id)}
            onFilterChange={handleFilterChange}
          />
          <CallList calls={calls} />
        </div>
      ),
    },
    {
      id: "calendar",
      label: "Calendrier",
      content: (
        <div className="bg-white p-6 rounded-lg shadow">
          <Calendar events={calendarEvents} />
        </div>
      )
    }
  ];

   if (loading) return <div className="p-8 max-w-7xl mx-auto">Chargement...</div>;

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
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pronta Calls - Tableau de bord</h1>
        <CallStats {...stats} />
        <div className="mt-8">
          <Tabs tabs={tabs} defaultTab="calls" />
        </div>
      </div>
      <div className="flex-1">
      </div>
    </div>


    
  );
}