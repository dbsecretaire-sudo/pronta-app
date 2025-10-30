import { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Table from "@/app/components/ui/Table";
import Pagination from "@/app/components/ui/Pagination";
import Modal from "@/app/components/ui/Modal";
import { Client } from "@/app/components/models/client";
import Link from "next/link";

interface ClientListProps {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onDelete: (clientId: string) => void;
  loading: boolean;
}

export default function ClientList({
  clients,
  totalClients,
  currentPage,
  itemsPerPage,
  onPageChange,
  onSearch,
  onDelete,
  loading
}: ClientListProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const totalPages = Math.ceil(totalClients / itemsPerPage);

  const columns : {
    header : string;
    accessor : keyof Client;
    render? : (value: any, row: Client) => React.ReactNode;
  }[] = [
    { header: "Nom", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Téléphone",
      accessor: "phone",
      render: (value: string) => value || "N/A"
    },
    {
      header: "Entreprise",
      accessor: "company",
      render: (value: string) => value || "N/A"
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes clients</h1>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/Services/prontaInvoices/clients/new"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau client
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>

      {/* Tableau des clients */}
      <Table
        data={clients}
        columns={columns}
        actions={(client) => (
          <div className="flex space-x-2">
            <Link
              href={`/dashboard/Services/prontaInvoices/clients/${client.id}/edit`}
              className="text-blue-600 hover:text-blue-900"
              title="Modifier"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={() => {
                setClientToDelete(client);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:text-red-900"
              title="Supprimer"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        emptyMessage={
          loading ? "Chargement..." :
          "Aucun client trouvé. " +
          <Link href="/dashboard/Services/prontaInvoices/clients/new" className="text-blue-600 hover:underline">
            Créer un nouveau client
          </Link>
        }
      />

      {/* Pagination */}
      {totalClients > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Supprimer le client"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (clientToDelete) {
                  onDelete(clientToDelete.id);
                  setIsDeleteModalOpen(false);
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
          </>
        }
      >
        {clientToDelete && (
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le client <strong>{clientToDelete.name}</strong> ?
            Cette action est irréversible.
          </p>
        )}
      </Modal>
    </>
  );
}
