// app/api/UserServices/[userId]/route.ts
import { NextResponse } from 'next/server';
import {
  getUserServices,
  assignServiceToUser,
  deactivateUserService
} from '../controller';

// GET /api/UserServices/[userId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params; // ✅ Utilise await pour les params
    const services = await getUserServices(Number(userId));
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/UserServices/[userId]
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> } // ✅ Changez ici aussi
) {
  try {
    const { userId } = await params; // ✅ Utilisez await pour obtenir userId
    const data = await request.json();
    const newUserService = await assignServiceToUser({
      user_id: Number(userId),
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } } // Pas besoin de `Promise`, Next.js le résout automatiquement
) {
  try {
    const { id } = params; // `params` est déjà résolu
    const { serviceId } = await request.json();
    const userId = Number(id);

    const result = await deactivateUserService(userId, serviceId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la désactivation du service:", error);
    return NextResponse.json(
      { error: 'Erreur lors de la désactivation du service' },
      { status: 500 }
    );
  }
}
