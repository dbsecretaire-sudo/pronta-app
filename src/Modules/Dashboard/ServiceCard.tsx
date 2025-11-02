// src/Modules/ServiceCard.tsx
import { UserService, UserServiceWithDetails } from '@/src/Types/UserServices';
import Link from 'next/link';

interface ServiceCardProps {
  service: any;
  isSubscribed?: boolean;
  onSubscribe?: (serviceId: number) => void;
  onDeactivate?: (serviceId: number) => void;
  onReactivate?: (serviceId: number) => void;
  userService?: UserService;
}

export const ServiceCard = ({ 
  service, 
  isSubscribed, 
  onSubscribe, 
  onDeactivate,
  onReactivate,
  userService
}: ServiceCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center mb-3">
      <span className="text-2xl mr-3">{service.icon}</span>
      <h3 className="text-lg font-medium">{service.name}</h3>
    </div>
    <p className="text-gray-600 mb-4">{service.description}</p>    
    
    {/* Actions */}
    {isSubscribed ? (
      <>
        {userService?.is_active && ( // ✅ Affiche "Accéder" uniquement si actif
          <Link href={service.route} className="text-sm text-blue-600 font-medium block mb-2">
            Accéder →
          </Link>
        )}
        {userService?.is_active ? (
          <button
            onClick={() => onDeactivate?.(service.id)} // ✅ Bouton "Désactiver" pour les services actifs
            className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200"
          >
            Désactiver
          </button>
        ) : (
          <button
            onClick={() => {console.log("Réactiver cliqué pour:", service.id); onReactivate?.(service.id);}} // ✅ Bouton "Réactiver" pour les services désactivés
            className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200"
          >
            Réactiver
          </button>
        )}
      </>
    ) : (
      <button
        onClick={() => onSubscribe?.(service.id)} // ✅ Bouton "Souscrire" pour les services non abonnés
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Souscrire
      </button>
    )}
    
  </div>
);
