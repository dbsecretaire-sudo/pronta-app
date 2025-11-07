// src/config/tableColumns.ts
import { Column } from '@/src/Components';

export const getTableColumns = (resource: string): Column<any>[] => {
  switch (resource) {
    case 'clients':
      return [
        { header: 'ID', accessor: 'id', sortable: true },
        { header: 'Nom', accessor: 'name', sortable: true },
        { header: 'Email', accessor: 'email', sortable: true },
        { header: 'Téléphone', accessor: 'phone', sortable: true },
        { header: 'Entreprise', accessor: 'company', sortable: true },
      ];

    case 'calls':
      return [
        { header: 'Numéro', accessor: 'phone', type: 'text', filterType: 'text', sortable: true },
        {
          header: 'Secrétaire',
          accessor: 'user_id',
          type: 'userName',
          filterType: 'select',
          dataMap: 'secretaries',
          sortable: true
        },
        {
          header: 'Client',
          accessor: 'client_id',
          type: 'userName',
          filterType: 'select',
          dataMap: 'clients',
          sortable: true
        },
        {
          header: 'Type',
          accessor: 'type',
          type: 'typeBadge',
          filterType: 'select',
          typeData: {
            incoming: { label: 'Entrant', color: 'green' },
            outgoing: { label: 'Sortant', color: 'blue' },
            missed: { label: 'Manqué', color: 'red' }
          },
          filterOptions: [
            { value: 'incoming', label: 'Entrant' },
            { value: 'outgoing', label: 'Sortant' },
            { value: 'missed', label: 'Manqué' }
          ],
          sortable: true
        },
        {
          header: 'Date',
          accessor: 'date',
          type: 'date',
          filterType: 'date',
          sortable: true
        },
        {
          header: 'Durée',
          accessor: 'duration',
          type: 'duration',
          filterType: 'duration',
          sortable: true
        },
    ];

    case 'users':
      return [
        { header: 'ID', accessor: 'id', sortable: true },
        { header: 'Nom', accessor: 'name', sortable: true, filterType: 'text' },
        { header: 'Email', accessor: 'email', sortable: true, filterType: 'text' },
        { header: 'Téléphone', accessor: 'phone', sortable: true, filterType: 'text' },
        {
          header: 'Rôle',
          accessor: 'role',
          type: 'typeBadge',
          filterType: 'select',
          typeData: {
            CLIENT: { label: 'Client', color: 'blue' },
            SECRETARY: { label: 'Secrétaire', color: 'green' },
            ADMIN: { label: 'Admin', color: 'red' }
          },
          filterOptions: [
            { value: 'CLIENT', label: 'Client' },
            { value: 'SECRETARY', label: 'Secrétaire' },
            { value: 'ADMIN', label: 'Admin' }
          ],
          sortable: true
        },
      ];

    default:
      return [];
  }
};
