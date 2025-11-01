// app/api/clients/search/route.ts
import { NextResponse } from 'next/server';
import { searchClients } from '../controller'; // Importez votre fonction

// GET /api/clients/search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const userId = searchParams.get('userId');

    if (!query || !userId) {
      return NextResponse.json(
        { error: "query and userId are required" },
        { status: 400 }
      );
    }

    const results = await searchClients({
      query,
      userId: Number(userId),
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search clients" },
      { status: 500 }
    );
  }
}
