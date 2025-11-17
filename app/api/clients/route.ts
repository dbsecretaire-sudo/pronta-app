// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from './service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const clientService = new ClientService();

// GET /api/clients
export async function GET(request: NextRequest,) {

  return withAuth(request, async (session) => {

    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        const clients = await clientService.getAllClients();
        return NextResponse.json(clients);
      }

      const clients = await clientService.getClientsByUserId(Number(userId));
      return NextResponse.json(clients);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to fetch clients" },
        { status: 500 }
      );
    }
  });
}

// POST /api/clients
export async function POST(request: NextRequest,) {

  return withAuth(request, async (session) => {

    try {
      const clientData = await request.json();
      const newClient = await clientService.createClient(clientData);
      return NextResponse.json(newClient, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to create client" },
        { status: 500 }
      );
    }
  });
}
