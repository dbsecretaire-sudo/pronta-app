// src/app/admin/[resource]/page.tsx
import { fetchResource } from '@/src/lib/admin/api';
import { notFound } from 'next/navigation';
import { CallDataTable, getTableColumns } from '@/src/Components';
import { fetchUsersRole, fetchUsersName } from '@/src/lib/api';

interface ResourcePageProps {
  params: Promise<{ resource: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface UserMap {
  [id: number]: { id: number; name: string };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { resource } = await params;
  const data = await fetchResource(resource);

  // Récupérer les rôles et les noms des utilisateurs
  const [usersRole, usersName] = await Promise.all([
    fetchUsersRole(),
    resource === 'calls' ? fetchUsersName() : Promise.resolve({})
  ]);

  if (!data) {
    return notFound();
  }

  // Créer les dataMaps avec le bon typage
  const dataMaps: Record<string, UserMap> = {
    secretaries: Object.fromEntries(
      Object.entries(usersName)
        .filter(([id, _]) => {
          const userRole = usersRole[Number(id)]?.role;
          return userRole === 'ADMIN' || userRole === 'SECRETARY' || userRole === "SUPERVISOR";
        })
        // .map(([id, user]) => [Number(id), user])
    ) as UserMap,
    clients: Object.fromEntries(
      Object.entries(usersName)
        .filter(([id, _]) => usersRole[Number(id)]?.role === 'CLIENT')
        .map(([id, user]) => [Number(id), user])
    ) as UserMap
  };

  const columns = getTableColumns(resource);

  return (
    <div className="space-y-6 p-6">
      <CallDataTable
        data={data}
        columns={columns}
        resourceName={resource}
        createHref={`/admin/${resource}/new`}
        dataMaps={dataMaps}
      />
    </div>
  );
}
