// app/components/ServiceCard.tsx
import Link from 'next/link';

interface ServiceCardProps {
  service: any;
  isSubscribed?: boolean;
  onSubscribe?: (serviceId: number) => void;
}

export const ServiceCard = ({ service, isSubscribed, onSubscribe }: ServiceCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-center mb-3">
      <span className="text-2xl mr-3">{service.icon}</span>
      <h3 className="text-lg font-medium">{service.name}</h3>
    </div>
    <p className="text-gray-600 mb-4">{service.description}</p>
    {isSubscribed ? (
      <Link href={service.route} className="text-sm text-blue-600 font-medium">
        Accéder →
      </Link>
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
