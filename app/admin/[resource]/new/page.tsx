// app/admin/[resource]/new/page.tsx
'use client';
import { useFormState } from 'react-dom';
import { notFound, redirect } from 'next/navigation';
import { createResource } from '@/app/actions/admin';


export default function NewResourcePage({
  params,
}: {
  params: { resource: string };
}) {
  const { resource } = params;
  const [state, formAction] = useFormState(
    createResource.bind(null, resource),
    {}
  );
  // Vérifie si la ressource est supportée
  const isValidResource = ['clients', 'calls'].includes(resource);
  if (!isValidResource) {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">
        Nouveau {resource === 'clients' ? 'client' : 'appel'}
      </h1>
      <form action={formAction} className="space-y-4">
        {resource === 'clients' ? (
          <>
            <div>
              <label htmlFor="name" className="block mb-1">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="title" className="block mb-1">
                Titre
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block mb-1">
                Date
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Créer
        </button>
      </form>
    </div>
  );
}
