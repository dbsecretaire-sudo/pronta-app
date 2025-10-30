import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import CalendarClientContent from '@/app/components/CalendarClientContent';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  // Vérification côté serveur uniquement
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  // Le contenu client est chargé via un composant séparé
  return <CalendarClientContent />;
}