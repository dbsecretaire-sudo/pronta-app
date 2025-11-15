// app/api/clients/search/route.ts
import { NextResponse } from 'next/server';
import { ClientService } from '../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const clientService = new ClientService;
// GET /api/clients/search
export async function GET(request: Request) {

  const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

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

    const results = await clientService.searchClients({
      userId: Number(userId),
      searchTerm: query,
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search clients" },
      { status: 500 }
    );
  }
}
