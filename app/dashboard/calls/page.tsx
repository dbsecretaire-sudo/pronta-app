"use client";
import { useState, useEffect } from "react";
import CallList from "@/app/components/CallList";
import CallFilter from "@/app/components/CallFilter";
import { fetchCalls } from "@/app/lib/api";
import { useAuth } from '@/app/hook/useAuth';

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [filter, setFilter] = useState({ byName: "", byPhone: "" });

  useAuth();

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
