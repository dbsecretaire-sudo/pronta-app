// app/admin/page.tsx
import Link from 'next/link';
import { FaUsers, FaPhone, FaFileInvoice } from 'react-icons/fa';

export default function AdminPage() {
  const resources = [
    { name: 'Clients', path: '/admin/clients', icon: <FaUsers className="mr-2" /> },
    { name: 'Appels', path: '/admin/calls', icon: <FaPhone className="mr-2" /> },
    { name: 'Factures', path: '/admin/invoices', icon: <FaFileInvoice className="mr-2" /> },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Link
            key={resource.path}
            href={resource.path}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex items-center">
              {resource.icon}
              <span className="font-medium">{resource.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}