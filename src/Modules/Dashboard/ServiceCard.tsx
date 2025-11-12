// src/Modules/ServiceCard.tsx
import { Service } from '@/src/lib/schemas/services';
import { Subscription } from '@/src/lib/schemas/subscription';
// import { UserService, UserServiceWithDetails } from '@/src/Types/UserServices';
import Link from 'next/link';
import { useTab } from '@/src/context/TabContext';
import { useRouter } from 'next/navigation';

interface ServiceCardProps {
  service: any;
  isSubscribed?: boolean;
  onSubscribe?: (service: Service) => void;
  onDeactivate?: (service: Service) => void;
  onReactivate?: (service: Service) => void;
  subscription?: Subscription;
  // userService?: UserService;
}

export const ServiceCard = ({ 
  service, 
  isSubscribed, 
  onSubscribe, 
  onDeactivate,
  onReactivate,
  subscription
}: ServiceCardProps) => {

  const { setActiveTab } = useTab();
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-3">{service.icon}</span>
        <h3 className="text-lg font-medium">{service.name}</h3>
      </div>
      <p className="text-gray-600 mb-4">{service.description}</p>    
      
      {/* Actions */}
      {isSubscribed && subscription?.status === 'active' && (
        <>
          <Link href={service.route} className="text-sm text-blue-600 font-medium block mb-2">
            Accéder →
          </Link>
        </>
      )}

      {isSubscribed && subscription?.status !== "active" && (
        <>
          <button 
            onClick={() => {
              setActiveTab('billing');
              router.push('/dashboard/account')
            }}
            className="text-sm text-yellow-600 font-medium block mb-2 cursor-pointer"
          >
            Régulariser →
          </button>
        </>
      )}

      {!isSubscribed && (
        <button
          onClick={() => onSubscribe?.(service)} // ✅ Bouton "Souscrire" pour les services non abonnés
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Souscrire
        </button>
      )}
      
    </div>
  )
};
