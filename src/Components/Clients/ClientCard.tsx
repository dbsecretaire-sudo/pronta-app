"use client";
import React from "react";
import { PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ClientCardProps } from "@/src/Components"; 

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${compact ? "p-4" : "p-6"} border border-gray-100 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${compact ? "text-lg" : "text-xl"} text-gray-900 mb-1`}>
            {client.name}
          </h3>

          {!compact && (
            <div className="flex items-center text-gray-600 mb-3">
              <EnvelopeIcon className="h-4 w-4 mr-1.5" />
              <span className="text-sm">{client.email}</span>
            </div>
          )}
        </div>

        {showActions && (
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
        )}
      </div>

      {!compact && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {client.phone && (
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-1.5 text-blue-500" />
                <span className="text-sm">{client.phone}</span>
              </div>
            )}

            {client.company && (
              <div className="flex items-center text-gray-600">
                <BuildingOfficeIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                <span className="text-sm">{client.company}</span>
              </div>
            )}
          </div>

          {client.address && (
            <div className="flex items-start text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1.5 mt-0.5 text-green-500" />
              <span className="text-sm">{client.address}</span>
            </div>
          )}
        </>
      )}

      {compact && (
        <div className="mt-2">
          <div className="flex items-center text-gray-600 text-sm mb-1">
            <EnvelopeIcon className="h-3.5 w-3.5 mr-1" />
            <span>{client.email}</span>
          </div>

          {(client.phone || client.company) && (
            <div className="flex items-center text-gray-600 text-sm">
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
        </div>
      )}
    </div>
  );
};

export default ClientCard;
