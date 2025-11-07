// components/ResourceForm.tsx
'use client';
import { useFormState } from 'react-dom';
import { createResource } from '@/app/actions/admin';

interface ResourceFormProps {
  resource: string;
}

export default function ResourceForm({ resource }: ResourceFormProps) {
  const [state, formAction] = useFormState(
    createResource.bind(null, resource),
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {resource === 'clients' ? (
        <>
          <div>
            <label htmlFor="name" className="block mb-1">Nom</label>
            <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="title" className="block mb-1">Titre</label>
            <input type="text" id="title" name="title" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="date" className="block mb-1">Date</label>
            <input type="datetime-local" id="date" name="date" className="w-full p-2 border rounded" required />
          </div>
        </>
      )}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Créer
      </button>
    </form>
  );
}
