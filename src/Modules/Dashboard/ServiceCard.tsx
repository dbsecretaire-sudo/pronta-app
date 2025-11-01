// src/Modules/ServiceCard.tsx
import { UserServiceWithDetails } from '@/src/Types/UserServices';
import Link from 'next/link';

interface ServiceCardProps {
  service: any;
  isSubscribed?: boolean;
  onSubscribe?: (serviceId: number) => void;
  onDeactivate?: (serviceId: number) => void;
  userService?: UserServiceWithDetails;
}

export const ServiceCard = ({ 
  service, 
  isSubscribed, 
  onSubscribe, 
  onDeactivate,
  userService
}: ServiceCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center mb-3">
      <span className="text-2xl mr-3">{service.icon}</span>
      <h3 className="text-lg font-medium">{service.name}</h3>
    </div>
    <p className="text-gray-600 mb-4">{service.description}</p>
    {isSubscribed ? (
      <>
        <Link
          href={service.route}
          className="text-sm text-blue-600 font-medium block mb-2"
        >
          Accéder →
        </Link>
        {userService?.is_active ? (
          <button
            onClick={() => onDeactivate?.(service.id)} // Change onUnsubscribe en onDeactivate
            className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
          >
            Désactiver
          </button>
        ) : (
          <span className="text-gray-500 text-sm">Abonnement désactivé</span>
        )}
      </>
    ) : (
      <button
        onClick={() => onSubscribe?.(service.id)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Souscrire
      </button>
    )}
  </div>
);
