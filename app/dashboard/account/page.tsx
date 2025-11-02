"use client";
import { ProfileTab, BillingTab, MessagesTab } from "@/src/Components";
import { useAccount } from "@/src/Hook/useAccount";

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

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;
  if (!userData) return <div className="text-center py-8">Utilisateur non trouvé</div>;
console.log("account/page.tsx: ", userData);
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
            subscription_plan: userData.subscription_plan,
            subscription_end_date: userData.subscription_end_date,
            next_payment_date: userData.next_payment_date,
            subscription_status: userData.subscription_status,
            billing_address: userData.billing_address,
            payment_method: userData.payment_method,
          }}
          onEdit={handleBillingUpdate}
          isUpdating={isUpdating}
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
