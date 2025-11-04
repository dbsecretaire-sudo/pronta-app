"use client";
import { ProfileTab, BillingTab, MessagesTab } from "@/src/Components";
import { useAccount } from "@/src/Hook/useAccount";
import { Subscription, ApiSubscription, SubscriptionWithService } from "@/src/Types/Subscription";
import { useEffect, useState } from "react";
import { BillingTabData } from "@/src/Components/BillingTab/types";
import { fetchUserSubscriptions } from "@/src/lib/api";
import { useSession } from "next-auth/react";

export default function AccountPage() {
  const {
    userData,
    loading,
    error,
    activeTab,
    setActiveTab,
    isUpdating,
    handleProfileUpdate,
    handleBillingUpdate
  } = useAccount();
  const { data: session, status} = useSession();

  const [userSubscriptions, setUserSubscriptions] = useState<SubscriptionWithService[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      console.warn("Utilisateur non connecté ou ID manquant");
      return;
    }
    try {
      const result = await fetchUserSubscriptions(Number(session.user.id));
      // S'assurer que result est un tableau, sinon utiliser un tableau vide
      const subscriptions = Array.isArray(result) ? result : [];
      setUserSubscriptions(subscriptions);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnements:", error);
      setUserSubscriptions([]); 
    }
  };
  fetchData();
}, [session?.user?.id, status]);


  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;
  if (!userData) return <div className="text-center py-8">Utilisateur non trouvé</div>;


  // Fonction utilitaire pour convertir les dates en objets Date
  const ensureDate = (date: string | Date | undefined): Date | undefined => {
    if (!date) return undefined;
    return typeof date === 'string' ? new Date(date) : date;
  };

  // Fonction pour gérer les mises à jour de facturation 
  const handleBillingEdit = async (data: {
    billing_address?: any;
    payment_method?: any;
  }) => {
    const { billing_address, payment_method } = data;
    return handleBillingUpdate({ billing_address, payment_method });
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
            name: userData.name || "",
            role: userData.role || ""
          }}
          onEdit={handleProfileUpdate}
          isUpdating={isUpdating}
        />
      ),
    },
    {
      id: "billing",
      label: "Facturation",
      content: (
        <BillingTab
          data={{
            // Nouvelle structure avec les abonnements multiples
            id: userData.id,
            email: userData.email,
            subscriptions: userSubscriptions,
            billing_address: userData.billing_address,
            payment_method: userData.payment_method,
          }}
          onEdit={handleBillingEdit}
          isUpdating={isUpdating}
          // onDeleteSubscription={handleDeleteSubscription}
        />
      ),
    },
    {
      id: "messages",
      label: "Messages",
      content: <MessagesTab />,
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="p-8 max-w-4xl mx-auto w-full">
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
    </div>
  );
}
