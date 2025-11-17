// utils/apiWithAuth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function apiWithAuth<T>(
    fetchFn: () => Promise<T>,
    session: any // Reçois la session en paramètre
) {
    console.error("apiWithAuth",session);
  if (!session?.user?.id) {
    redirect('/login');
  }
  return fetchFn();
}