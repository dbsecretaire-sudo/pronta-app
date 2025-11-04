"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, MessageList, AccountSummary } from '@/src/Modules/index';
import { useState } from "react";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { services, availableServices, loading, handleSubscribe, handleDeactivate, handleReactivate } = useServices(session?.user?.id, status);

  // État pour le modal
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    route: "",
    price: 0,
    unit: '',
    icon: "🔧",
  });
  // État pour les erreurs et le chargement
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Séparation des services
// Services abonnés et actifs (pour "Mes services")
const subscribedServices = availableServices.filter(
  (s) => s.userService !== undefined && s.userService?.is_active
);

// Services à réactiver (lien existe mais inactif)
const servicesToReactivate = availableServices.filter(
  (s) => s.userService !== undefined && !s.userService?.is_active
);

// Services à souscrire (aucun lien avec l'utilisateur)
const servicesToSubscribe = availableServices.filter(
  (s) => s.userService === undefined
);

  // Gestion du changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Échec de la création du service");
      }

      const newService = await response.json();
      console.log("Service créé avec succès:", newService);
      // Rafraîchir la liste des services (optionnel)
      // Exemple : refreshServices();
      setIsAddServiceModalOpen(false);
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        description: "",
        route: "",
        price: 0,
        unit: "",
        icon: "🔧",
      });
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Services souscrits (actifs) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {subscribedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={true}
                onDeactivate={handleDeactivate}
                userService={service.userService}
              />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Vous n'avez souscrit à aucun service pour le moment.</p>
          </div>
        )}
      </section>

      {/* Services disponibles (à réactiver ou à souscrire) */}
      
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Services à réactiver */}
            {servicesToReactivate.length > 0 && servicesToReactivate.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={true}
                onReactivate={handleReactivate}
                userService={service.userService}
              />
            ))}
            {/* Services à souscrire */}
            {servicesToSubscribe.length > 0 &&
              servicesToSubscribe.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSubscribed={false}
                  onSubscribe={handleSubscribe}
                  userService={service.userService}
                />
              ))
            }
            {/* Bouton "Ajouter un service" */}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              onClick={() => setIsAddServiceModalOpen(true)}
            >
              Ajouter un service
            </button>
          </div>
        </section>
      {/* Modal d'ajout de service */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau service</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nom du service *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: Nettoyage de printemps"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Décrivez le service..."
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Route</label>
                <textarea
                  name="route"
                  value={formData.route}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: /dashboard/service/nouveauService"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Prix (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Unité</label>
                <input
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: heure, mois, ..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Icône (emoji)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: 🧹"
                  maxLength={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600"
                  onClick={() => setIsAddServiceModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "En cours..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Messagerie intégrée */}
      <section className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Messages importants</h2>
        </div>
        <p className="text-gray-500 italic">Aucun message pour le moment.</p>
      </section>

      {/* Section Mon Compte */}
      <AccountSummary />
    </div>
  );
}
