// app/components/AccountTabs.tsx
import { Tab } from '@headlessui/react';

interface AccountTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AccountTabs = ({ activeTab, setActiveTab }: AccountTabsProps) => {
  const tabs = [
    { id: 'profile', label: 'Informations personnelles' },
    { id: 'billing', label: 'Facturation' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div className="mb-6">
      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                    selected ? 'bg-white shadow text-blue-700' : 'text-blue-600 hover:bg-white/[0.12]'
                  }`
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Tab>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
