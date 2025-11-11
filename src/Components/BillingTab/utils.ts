export const getStatusStyle = (status?: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'active': return 'Actif';
    case 'paid': return 'Payé';
    case 'overdue': return 'En retard';
    case 'cancelled': return 'Annulé';
    case 'pending': return 'Suspendu';
    default: return 'Inconnu';
  }
};
