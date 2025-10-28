import React, { useState } from 'react';

export default function CallFilter({ onFilterChange }: { onFilterChange: (filter: { byName: string; byPhone: string }) => void }) {
  const [byName, setByName] = useState("");
  const [byPhone, setByPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ byName, byPhone });
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Filtrer
      </button>
    </form>
  );
}
