// components/CallStats.tsx
import { CallStatsProps } from "./types";

export default function CallStats({ totalToday, missedToday, answerRate }: CallStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Appels aujourd'hui</h2>
        <p className="text-3xl font-bold text-blue-600">{totalToday}</p>
        <p className="text-sm text-gray-500 mt-1">Appels enregistrés</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Appels manqués</h2>
        <p className="text-3xl font-bold text-red-600">{missedToday}</p>
        <p className="text-sm text-gray-500 mt-1">
          {missedToday > 0 ? `${missedToday} en attente de rappel` : "Aucun appel manqué"}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Taux de réponse</h2>
        <p className="text-3xl font-bold text-green-600">{answerRate}%</p>
        <p className="text-sm text-gray-500 mt-1">Moyenne sur 7 jours</p>
      </div>
    </div>
  );
}
