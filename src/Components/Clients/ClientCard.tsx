"use client";
import React from "react";
import {
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { ClientCardProps } from "@/src/Components";

const InfoLine = ({
  icon: Icon,
  value,
  color = "text-gray-500",
  iconSize = "h-4 w-4",
  textSize = "text-sm"
}: {
  icon: React.ComponentType<{ className: string }>;
  value: string ;
  color?: string;
  iconSize?: string;
  textSize?: string;
}) => (
  <div className="flex items-center">
    <Icon className={`${iconSize} mr-1.5 ${color}`} />
    <span className={textSize}>{value}</span>
  </div>
);

const CompactInfo = ({ client }: { client: ClientCardProps["client"] }) => (
  <>
    <InfoLine
      icon={EnvelopeIcon}
      value={client.email}
      iconSize="h-3.5 w-3.5"
      textSize="text-sm"
    />
    {(client.phone || client.company) && (
      <div className="flex items-center text-gray-600 text-sm mt-1">
        {client.phone && (
          <>
            <PhoneIcon className="h-3.5 w-3.5 mr-1" />
            <span>{client.phone}</span>
            {client.company && <span className="mx-1">•</span>}
          </>
        )}
        {client.company && (
          <>
            <BuildingOfficeIcon className="h-3.5 w-3.5 mr-1" />
            <span>{client.company}</span>
          </>
        )}
      </div>
    )}
  </>
);

const AddressLine = ({ address }: { address: ClientCardProps["client"]["address"] }) => {
  const parts = [
    address?.street,
    address?.postalCode,
    address?.city,
    address?.state,
    address?.country,
  ].filter(Boolean);

  return (
    <div className="flex items-center">
      <MapPinIcon className="h-4 w-4 mt-0.5 mr-1.5 text-green-500" />
      <span className="text-sm">{parts.join(', ')}</span>
    </div>
  );
};


const ActionButtons = ({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) => (
  <div className="flex space-x-2">
    {onEdit && (
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
        title="Modifier"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
        title="Supprimer"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  className = "",
}) => {
  const padding = compact ? "p-4" : "p-6";
  const titleSize = compact ? "text-lg" : "text-xl";

  return (
    <div className={`bg-white rounded-lg shadow ${padding} border border-gray-100 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${titleSize} text-gray-900 mb-1`}>
            {client.name}
          </h3>
          {!compact && (
            <InfoLine
              icon={EnvelopeIcon}
              value={client.email}
              color="text-gray-600"
              textSize="text-sm"
            />
          )}
        </div>
        {showActions && <ActionButtons onEdit={onEdit} onDelete={onDelete} />}
      </div>

      {!compact ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {client.phone && (
              <InfoLine
                icon={PhoneIcon}
                value={client.phone}
                color="text-blue-500"
              />
            )}
            {client.company && (
              <InfoLine
                icon={BuildingOfficeIcon}
                value={client.company}
                color="text-purple-500"
              />
            )}
          </div>
          {client.address && <AddressLine address={client.address} />}
        </>
      ) : (
        <div className="mt-2">
          <CompactInfo client={client} />
        </div>
      )}
    </div>
  );
};

export default ClientCard;
