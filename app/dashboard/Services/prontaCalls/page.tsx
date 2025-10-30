export default function ProntaCallsDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pronta Calls - Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cartes de statistiques */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Appels aujourd'hui</h2>
          <p className="text-3xl font-bold text-blue-600">24</p>
          <p className="text-sm text-gray-500 mt-1">+5 depuis hier</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Appels manqués</h2>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-gray-500 mt-1">1 en attente de rappel</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Taux de réponse</h2>
          <p className="text-3xl font-bold text-green-600">88%</p>
          <p className="text-sm text-gray-500 mt-1">Moyenne sur 7 jours</p>
        </div>
      </div>

      {/* Contenu spécifique à ProntaCalls */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Appels récents</h2>
        {/* Liste des appels récents */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Exemple de données */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Jean Dupont</td>
                <td className="px-6 py-4 whitespace-nowrap">0612345678</td>
                <td className="px-6 py-4 whitespace-nowrap">10:30</td>
                <td className="px-6 py-4 whitespace-nowrap">2 min 34 s</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Répondu
                  </span>
                </td>
              </tr>
              {/* Autres lignes... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
