// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { ClientService } from './service';

const clientService = new ClientService();

// GET /api/clients
export async function GET(request: Request) {
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
}

// POST /api/clients
export async function POST(request: Request) {
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
}
