// src/app/admin/[resource]/page.tsx
import { notFound } from 'next/navigation';
import { DataTableUi } from '@/src/Components'; // Utilise DataTableUi à la place de CallDataTable
import { resourcesConfig } from '@/src/lib/admin/resources';
import { fetchUsersRole, fetchUsersName, fetchAllServices, fetchAllCalls, fetchAllClients, fetchAllSubscriptions, fetchInvoices, fetchCalendar, fetchUsers, fetchInvoiceItems } from '@/src/lib/api';

interface ResourcePageProps {
  params: Promise<{ resource: string }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { resource } = await params;
  const config = resourcesConfig[resource];

  if (!config) {
    return notFound();
  }

  const data = await config.fetchData();

  // Récupérer les données pour dataMaps
  const [usersRole, usersName, services, subscriptions, invoices, calendarEvents, clients, calls, users, invoiceItems] = await Promise.all([
    fetchUsersRole(),
    fetchUsersName(),
    fetchAllServices(),
    fetchAllSubscriptions(),
    fetchInvoices(),
    fetchCalendar(),
    // fetchAllUserServices(),
    fetchAllClients(),
    fetchAllCalls(), 
    fetchUsers(),
    fetchInvoiceItems(),
  ]);

  if (!data) {
    return notFound();
  }
const itemsArray = Array.isArray(invoiceItems) ? invoiceItems : [];
const itemsByInvoiceId = itemsArray.reduce((acc, item) => {
  if (!acc[item.invoice_id]) {
    acc[item.invoice_id] = [];
  }
  acc[item.invoice_id].push(item);
  return acc;
}, {} as Record<number, any[]>);

// 2. Associe les items à chaque facture
const invoicesWithItems = invoices.map(invoice => ({
  ...invoice,
  items: itemsByInvoiceId[invoice.id] || [], // Items de cette facture
}));

  // Créer les dataMaps
  const dataMaps = {
      // Secrétaires et administrateurs
      secretaries: Object.fromEntries(
        Object.entries(usersName)
          .filter(([id, _]) => {
            const userRole = usersRole[Number(id)]?.role;
            return userRole === 'ADMIN' || userRole === 'SECRETARY' || userRole === 'SUPERVISOR';
          })
          .map(([id, user]) => [Number(id), user])
      ),
      // Clients
      usersClients: Object.fromEntries(
        Object.entries(usersName)
          .filter(([id, _]) => usersRole[Number(id)]?.role === 'CLIENT')
          .map(([id, user]) => [Number(id), user])
      ),
      // Tous les utilisateurs
      users: Object.fromEntries(
        users.map((user) => [user.id, user])
      ),
      // Services
      services: Object.fromEntries(
        services.map((service) => [service.id, service])
      ),
      // Abonnements
      subscriptions: Object.fromEntries(
        subscriptions.map((sub) => [sub.id, sub])
      ),
      // // Services utilisateurs (clé composite)
      // userServices: Object.fromEntries(
      //   userServices.map((us) => [`${us.user_id}-${us.service_id}`, us])
      // ),
      // Factures
      invoices: Object.fromEntries(
        invoicesWithItems.map((invoice) => [invoice.id, invoice])
      ),
      // Calendrier
      calendar: Object.fromEntries(
        calendarEvents.map((event) => [event.id, event])
      ),
      // Clients pour les factures
      clients: Object.fromEntries(
        clients.map((client) => [client.id, client])
      ),
      // Appels
      calls: Object.fromEntries(
        calls.map((call) => [call.id, call])
      )
    };

  return (
    <div className="space-y-6 p-6">
      <DataTableUi
        data={data}
        columns={config.getColumns()} // Utilise les colonnes définies dans resourcesConfig
        resourceName={resource}
        createHref={`/admin/${resource}/new`}
        dataMaps={dataMaps}
      />
    </div>
  );
}
