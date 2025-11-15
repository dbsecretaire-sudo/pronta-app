// Types/Components/Calls/CallFilter.tsx
"use client";
import { useState } from "react";
import { CallFilterProps } from "./types";

export default function CallFilter({ onFilterChange, userId }: CallFilterProps) {
  const [byName, setByName] = useState("");
  const [byPhone, setByPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onFilterChange({
      userId,         
      byName,
      byPhone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-4">
      <input
        type="text"
        placeholder="Filtrer par nom"
        value={byName}
        onChange={(e) => setByName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Filtrer par téléphone"
        value={byPhone}
        onChange={(e) => setByPhone(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer">
        Filtrer
      </button>
    </form>
  );
}
