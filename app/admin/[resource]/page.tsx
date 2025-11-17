// app/admin/[resource]/page.tsx
import { notFound } from 'next/navigation';
import { DataTableUi } from '@/src/Components';
import { resourcesConfig } from '@/src/lib/admin/resources';
import { fetchUsersRole, fetchUsersName, fetchAllServices, fetchAllSubscriptions, fetchInvoices, fetchCalendar, fetchAllClients, fetchAllCalls, fetchUsers, fetchInvoiceItems, getRoleByUserId } from '@/src/lib/api';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react';

interface PageProps {
  params: { resource: string };
  searchParams: { [key: string]: string | string[] };
}

export default async function ResourcePage({
  params,
  searchParams,
}: PageProps) {

  const { resource } = await params;
  const accessToken = (await searchParams).accessToken as string ;  
  // console.log("accessToken", await searchParams.accessToken);
  // const accessToken = searchParams.get('accessToken');
  const config = resourcesConfig[resource];
  if (!config) {
    return notFound();
  }

  const data = await config.fetchData(accessToken); 

  const [usersRole, usersName, services, subscriptions, invoices, calendarEvents, clients, calls, users, invoiceItems] =
    await Promise.all([
      fetchUsersRole(accessToken),
      fetchUsersName(accessToken),
      fetchAllServices(accessToken),
      fetchAllSubscriptions(accessToken),
      fetchInvoices(accessToken),
      fetchCalendar(accessToken),
      fetchAllClients(accessToken),
      fetchAllCalls(accessToken),
      fetchUsers(accessToken),
      fetchInvoiceItems(accessToken),
    ]);


  const itemsArray = Array.isArray(invoiceItems) ? invoiceItems : [];
  const itemsByInvoiceId = itemsArray.reduce((acc, item) => {
    if (!acc[item.invoice_id]) {
      acc[item.invoice_id] = [];
    }
    acc[item.invoice_id].push(item);
    return acc;
  }, {} as Record<number, any[]>);

  const invoicesWithItems = invoices.map(invoice => ({
    ...invoice,
    items: itemsByInvoiceId[invoice.id] || [],
  }));

  const dataMaps = {
    secretaries: Object.fromEntries(
      Object.entries(usersName)
        .filter(([id, _]) => {
          const userRole = usersRole[Number(id)]?.role;
          return userRole === 'ADMIN' || userRole === 'SECRETARY' || userRole === 'SUPERVISOR';
        })
        .map(([id, user]) => [Number(id), user])
    ),
    usersClients: Object.fromEntries(
      Object.entries(usersName)
        .filter(([id, _]) => usersRole[Number(id)]?.role === 'CLIENT')
        .map(([id, user]) => [Number(id), user])
    ),
    users: Object.fromEntries(
      users.map((user) => [user.id, user])
    ),
    services: Object.fromEntries(
      services.map((service) => [service.id, service])
    ),
    subscriptions: Object.fromEntries(
      subscriptions.map((sub) => [sub.id, sub])
    ),
    invoices: Object.fromEntries(
      invoicesWithItems.map((invoice) => [invoice.id, invoice])
    ),
    calendar: Object.fromEntries(
      calendarEvents.map((event) => [event.id, event])
    ),
    clients: Object.fromEntries(
      clients.map((client) => [client.id, client])
    ),
    calls: Object.fromEntries(
      calls.map((call) => [call.id, call])
    ),
  };

  // Passe session et role à DataTableUi via un wrapper client
  return (
    <div className="space-y-6 p-6">
      <DataTableUi
        data={data}
        columns={config.getColumns()}
        resourceName={(await params).resource}
        createHref={`/admin/${(await params).resource}/new`}
        dataMaps={dataMaps}
        // session={session}
        // role={role}
      />
    </div>
  );
}
