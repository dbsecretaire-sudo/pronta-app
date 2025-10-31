"use client";
import { useState, useEffect } from "react";
import CallList from "@/Types/Components/Calls/CallList";
import CallFilter from "@/Types/Components/Calls/CallFilter";
import { fetchCalls } from "@/lib/api";

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [filter, setFilter] = useState({ byName: "", byPhone: "" });

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
      <CallFilter onFilterChange={setFilter} />
      <CallList calls={calls} />
    </div>
  );
}
