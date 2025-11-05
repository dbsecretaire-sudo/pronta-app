"use client";
import { useState, useEffect } from "react";
import { CallList, CallFilter } from "@/src/Components";
import { fetchCalls } from "@/src/lib/api";
import { CallFilter as CallFilterType } from "@/src/Types/Calls/index";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { CallModal } from "@/src/Components";

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CallFilterType>({
    userId: 0,
    byName: "",
    byPhone: "",
  });
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const initiateZoiperCall = (phoneNumber: string) => {
    if (window.ZoiperAPI) {
      window.ZoiperAPI.call(phoneNumber);
    } else {
      console.warn("Zoiper API non disponible, utilisation du fallback tel:");
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  useEffect(() => {
    const loadCalls = async () => {
      setLoading(true);
      try {
        const data = await fetchCalls(filter);
        setCalls(data);
      } catch (error) {
        console.error("Erreur lors du chargement des appels:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCalls();
  }, [filter]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historique des appels</h1>

        <button
          onClick={() => setIsCallModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PhoneIcon className="h-5 w-5 mr-2" />
          Passer un appel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <CallFilter
          onFilterChange={setFilter}
          userId={filter.userId}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Chargement des appels...</p>
        </div>
      ) : calls.length > 0 ? (
        <CallList
          calls={calls}
          onCallClick={initiateZoiperCall}
        />
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun appel trouvé</p>
        </div>
      )}

      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        onCall={initiateZoiperCall}
      />
    </div>
  );
}
