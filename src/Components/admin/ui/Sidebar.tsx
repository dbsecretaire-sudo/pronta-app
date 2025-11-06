// src/components/admin/ui/Sidebar.tsx
"use client";
import Link from 'next/link';
import { HomeIcon, UsersIcon, PhoneIcon, CogIcon } from '@heroicons/react/24/outline';

const adminRoutes = [
  { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
  { name: 'Clients', href: '/admin/clients', icon: UsersIcon },
  { name: 'Appels', href: '/admin/calls', icon: PhoneIcon },
  { name: 'Paramètres', href: '/admin/settings', icon: CogIcon },
];

export function AdminSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {adminRoutes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
              >
                <route.icon className="w-5 h-5 mr-3" />
                <span>{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
