"use client";
import { NavBar } from "@/src/Components/index";
import { Tabs } from "@/src/Components/Tabs";
import { ProfileTab } from "@/src/Components/ProfileTab";
import { useUser } from "@/src/Hook/useUser";
import { useState } from "react";

export default function AccountPage() {
  const { userData, loading, error, mutate } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (!userData) return <div className="text-center py-8">Utilisateur non trouvé</div>;

  const navItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: "📊" },
    { name: "Mon compte", path: "/dashboard/account", icon: "👤" },
  ];

  const handleProfileUpdate = async (updatedData: {
    email: string;
    phone: string;
    company: string;
  }) => {
    try {
      const response = await fetch(`/api/user/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");

      // Rafraîchir les données après la mise à jour
      mutate();
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const handleBillingUpdate = async (updatedData: {
    subscription_plan?: string;
    billing_address?: {
      street: string;
      city: string;
      state: string;
      postal_code: number;
      country: string;
    };
    payment_method?: {
      type: string;
      details: {
        card_last_four?: string;
        card_brand?: string;
        paypal_email?: string;
      };
      is_default: boolean;
    };
  }) => {
    try {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");

      mutate();
      alert("Informations de facturation mises à jour !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Informations personnelles",
      content: (
        <ProfileTab
          data={{
            email: userData.email,
            phone: userData.phone || "",
            company: userData.company || "",
          }}
          onEdit={handleProfileUpdate}
        />
      ),
    },
    {
      id: "billing",
      label: "Facturation",
      content: (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Abonnement</h2>
          <div className="space-y-6">
            {/* Plan d'abonnement */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plan actuel</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {userData.subscription_plan || "Aucun"}
                </span>
              </div>
              {userData.subscription_end_date && (
                <p className="text-sm text-gray-600 mt-2">
                  Valide jusqu'au {new Date(userData.subscription_end_date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            {/* Adresse de facturation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Adresse de facturation</h3>
              {userData.billing_address ? (
                <div className="space-y-1">
                  <p>{userData.billing_address.street}</p>
                  <p>{userData.billing_address.postal_code} {userData.billing_address.city}</p>
                  <p>{userData.billing_address.country}</p>
                  <button
                    onClick={() => {
                      const newAddress = prompt("Nouvelle adresse (format: Rue, Ville, Code postal, Pays)");
                      if (newAddress) {
                        const [street, city, postal_code, country] = newAddress.split(',').map(s => s.trim());
                        handleBillingUpdate({
                          billing_address: {
                            street,
                            city,
                            state: "", // À compléter si nécessaire
                            postal_code: parseInt(postal_code),
                            country
                          }
                        });
                      }
                    }}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Modifier l'adresse
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Aucune adresse de facturation</p>
              )}
            </div>

            {/* Méthode de paiement */}
            {userData.payment_method && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Méthode de paiement</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="capitalize">{userData.payment_method.type?.replace('_', ' ')}</p>
                    {userData.payment_method.type === 'credit_card' && (
                      <p>•••• {userData.payment_method.details?.card_last_four}</p>
                    )}
                    {userData.payment_method.type === 'paypal' && (
                      <p>{userData.payment_method.details?.paypal_email}</p>
                    )}
                  </div>
                  <button
                    onClick={() => alert("Fonctionnalité à implémenter")}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "messages",
      label: "Messages",
      content: (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mes messages</h2>
          <div className="space-y-4">
            {/* {userData.messages?.length ? (
              userData.messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${!message.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{message.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{message.content}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.date).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  {!message.isRead && (
                    <button className="text-blue-600 text-sm hover:underline mt-2">
                      Marquer comme lu
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucun message</p>
            )} */}
          </div>
        </div>
      ),
    },
  ];
if (loading) return <div>Chargement...</div>;
if (error) return <div>Erreur: {error}</div>;
if (!userData) return <div>Utilisateur non trouvé</div>;
  return (
    <NavBar navItems={navItems} showLogo={true} isInService={false}>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Mon compte</h1>

        {/* Version mobile */}
        <div className="sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Version desktop */}
        <div className="hidden sm:block mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 border-b-2'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu de l'onglet actif */}
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </NavBar>
  );
}
