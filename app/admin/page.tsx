// app/admin/page.tsx
import Link from 'next/link';
import {
  FaUsers,
  FaPhoneAlt,
  FaFileInvoice,
  FaCalendarAlt,
  FaUserTag,
  FaConciergeBell,
  FaUserCog,
  FaLayerGroup
} from 'react-icons/fa';

export default function AdminPage() {
  const resources = [
    {
      name: 'Clients',
      path: '/admin/clients',
      icon: <FaUsers className="mr-2 text-blue-500" />
    },
    {
      name: 'Appels',
      path: '/admin/calls',
      icon: <FaPhoneAlt className="mr-2 text-green-500" />
    },
    {
      name: 'Factures',
      path: '/admin/invoices',
      icon: <FaFileInvoice className="mr-2 text-purple-500" />
    },
    {
      name: 'Services',
      path: '/admin/services',
      icon: <FaConciergeBell className="mr-2 text-yellow-500" />
    },
    {
      name: 'Calendrier',
      path: '/admin/calendar',
      icon: <FaCalendarAlt className="mr-2 text-red-500" />
    },
    {
      name: 'Souscriptions',
      path: '/admin/subscriptions',
      icon: <FaLayerGroup className="mr-2 text-indigo-500" />
    },
    {
      name: 'Utilisateurs',
      path: '/admin/users',
      icon: <FaUserCog className="mr-2 text-gray-500" />
    },
    {
      name: 'Utilisateurs et Services',
      path: '/admin/userServices',
      icon: <FaUserTag className="mr-2 text-teal-500" />
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tableau de bord Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <Link
            key={resource.path}
            href={resource.path}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-transform transform hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center">
              {resource.icon}
              <span className="font-medium text-gray-700">{resource.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
