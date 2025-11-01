// app/api/user-services/[userId]/route.ts
import { NextResponse } from 'next/server';
import {
  getUserServices,
  assignServiceToUser
} from '../controller';

// GET /api/user-services/[userId] (liste les services d'un utilisateur)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> } 
) {
  try {
    const { userId } = await params; 
    const services = await getUserServices(Number(userId));
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/user-services/[userId] (assigner un service à un utilisateur)
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = Number(params.userId);
    const data = await request.json();
    const newUserService = await assignServiceToUser({
      user_id: userId,
      ...data
    });
    return NextResponse.json(newUserService, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to assign service" },
      { status: error instanceof Error && error.message.includes("required") ? 400 : 500 }
    );
  }
}
