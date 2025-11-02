"use client";
import { ReactNode, useState } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <div className="w-full">
      {/* Onglets pour mobile (sélecteur) */}
      <div className="sm:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Onglets pour desktop */}
      <div className="hidden sm:block mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  activeTab === tab.id
                    ? "bg-white shadow text-blue-700"
                    : "text-blue-600 hover:bg-white/[0.12]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div>
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
