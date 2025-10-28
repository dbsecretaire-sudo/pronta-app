import { Call } from "@/app/lib/types";

export default function CallList({ calls }: { calls: Call[] }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Téléphone</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Résumé</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{call.name}</td>
              <td className="p-2">{call.phone}</td>
              <td className="p-2">{call.type}</td>
              <td className="p-2">{new Date(call.date).toLocaleString()}</td>
              <td className="p-2">{call.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
