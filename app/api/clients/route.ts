// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { getClientsByUserId, createClient } from './controller'; // Importez vos fonctions

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

    const clients = await getClientsByUserId(Number(userId));
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// POST /api/clients
export async function POST(request: Request) {
  try {
    const clientData = await request.json();
    const newClient = await createClient(clientData);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
