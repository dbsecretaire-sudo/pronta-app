// src/Components/CallList.tsx
import { PhoneIcon } from "@heroicons/react/24/outline";

interface CallListProps {
  calls: Array<{
    id: number;
    phone?: string;
    contact_name?: string | undefined;
    date: string | Date | null;
    duration?: number;
    type: 'incoming' | 'outgoing' | 'missed';
  }>;
  onCallClick?: (phoneNumber: string) => void;
}

export function CallList({ calls, onCallClick }: CallListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {calls.map((call) => (
            <tr key={call.id}>
              <td className="px-6 py-4 whitespace-nowrap">{call.contact_name || "Inconnu"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{call.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(call.date!).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {call.duration !== undefined ?
                  `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, '0')}` :
                  'N/A'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  call.type === 'missed' ? 'bg-red-100 text-red-800' :
                  call.type === 'incoming' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {call.type === 'missed' ? 'Manqué' :
                   call.type === 'incoming' ? 'Entrant' : 'Sortant'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {onCallClick && (
                  <button
                    onClick={() => onCallClick(call.phone!)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Rappeler"
                  >
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
