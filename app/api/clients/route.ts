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
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const clients = await clientService.getClientsByUserId(Number(userId));
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
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
    console.error("Erreur lors de la création du client:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create client" },
      { status: 500 }
    );
  }
}
