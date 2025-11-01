"use client";
import { useState, useEffect } from "react";
import CallList from "@/app/src/Components/Calls/CallList";
import CallFilter from "@/app/src/Components/Calls/CallFilter";
import { fetchCalls } from "@/app/src/lib/api";
import { CallFilter as CallFilterType } from "@/app/src/Types/Calls/index";

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [filter, setFilter] = useState<CallFilterType>({
    userId: 0,
    byName: "",
    byPhone: "",
  });

  useEffect(() => {
    const loadCalls = async () => {
      const data = await fetchCalls(filter);
      setCalls(data);
    };
    loadCalls();
  }, [filter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appels</h1>
      <CallFilter
        onFilterChange={setFilter}
        userId={filter.userId}  // Passez userId ici
      />
      <CallList calls={calls} />
    </div>
  );
}
