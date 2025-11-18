// src/app/admin/[resource]/[id]/page.tsx
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ResourceEditForm } from '@/src/Components';
import { getServerToken, verifyAndDecodeToken } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface ResourceEditPageProps {
  params: Promise<{ resource: string, id: string }>;
}

export default async function ResourceEditPage({ params }: ResourceEditPageProps) {
  // const session = await getServerSession(authOptions);
  // const accessToken = session?.accessToken ?? null;
  const accessToken = await getServerToken();
  const { resource, id } = await params;

  const { valid, payload } = verifyAndDecodeToken(accessToken);
  if (!valid) {
    redirect('/login');
  }
  
  // Vérifiez que l'ID est un nombre valide
  if (!/^\d+$/.test(id)) {
    return notFound();
  }

  return (
    <div className="p-8">
       {/* Barre de retour spécifique à Admin */}
      <nav className="bg-white border-b border-gray-200 h-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <Link
              href="/admin"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center transition-colors"
            >
              ← Retour au tableau de bord Administration
            </Link>
            <div className="text-xl font-semibold text-gray-800">
              Administration
            </div>
          </div>
        </div>
      </nav>
      <ResourceEditForm
        resourceName={resource}
        id={parseInt(id)}
        accessToken={accessToken}
      />
    </div>
  );
}