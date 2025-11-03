"use client";
import { ProfileTab, BillingTab, MessagesTab } from "@/src/Components";
import { useAccount } from "@/src/Hook/useAccount";
import { Subscription, ApiSubscription } from "@/src/Types/Subscription";
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
    handleBillingUpdate,
    // handleCreateSubscription,
    // handleUpdateSubscription,
    // handleDeleteSubscription
  } = useAccount();
  const { data: session, status} = useSession();

  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session?.user?.id) {
        console.warn("Utilisateur non connecté ou ID manquant");
        return;
      }
      const subscriptions = await fetchUserSubscriptions(Number(session.user.id));
      setUserSubscriptions(subscriptions);
    };
    fetchData();
  }, [userData?.id]);


  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;
  if (!userData) return <div className="text-center py-8">Utilisateur non trouvé</div>;


  // Fonction utilitaire pour convertir les dates en objets Date
  const ensureDate = (date: string | Date | undefined): Date | undefined => {
    if (!date) return undefined;
    return typeof date === 'string' ? new Date(date) : date;
  };

  // Fonction pour gérer les mises à jour de facturation et abonnements
  const handleBillingEdit = async (data: {
    billing_address?: any;
    payment_method?: any;
    // subscription?: {
    //   id?: number;
    //   plan?: string;
    //   status?: string;
    //   start_date?: Date | string;
    //   end_date?: Date | string;
    //   next_payment_date?: Date | string;
    // };
  }) => {
    // Si on a des données d'abonnement
    // if (data.subscription) {
    //   const subscriptionData = {
    //     ...data.subscription,
    //     start_date: data.subscription.start_date ? ensureDate(data.subscription.start_date) : undefined,
    //     end_date: data.subscription.end_date ? ensureDate(data.subscription.end_date) : undefined,
    //     next_payment_date: data.subscription.next_payment_date ? ensureDate(data.subscription.next_payment_date) : undefined
    //   };

    //   // Si c'est un nouvel abonnement (pas d'ID)
    //   if (!subscriptionData.id) {
    //     return handleCreateSubscription({
    //       ...subscriptionData,
    //       user_id: userData.id
    //     } as Subscription);
    //   }
    //   // Sinon, c'est une mise à jour
    //   else {
    //     return handleUpdateSubscription(subscriptionData.id, subscriptionData);
    //   }
    // }
    // // Sinon, c'est une mise à jour des informations de facturation
    // else {
      const { billing_address, payment_method } = data;
      return handleBillingUpdate({ billing_address, payment_method });
    // }
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
            subscriptions: userSubscriptions ,
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
