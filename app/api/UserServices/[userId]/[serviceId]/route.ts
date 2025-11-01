// app/api/user-services/[userId]/[serviceId]/route.ts
import { NextResponse } from 'next/server';
import {
  getUserService,
  updateUserServicePermissions,
  deactivateUserService
} from '../../controller';

// GET /api/user-services/[userId]/[serviceId] (récupérer un service spécifique)
export async function GET(
  request: Request,
  { params }: { params: { userId: string; serviceId: string } }
) {
  try {
    const userId = Number(params.userId);
    const serviceId = Number(params.serviceId);
    const userService = await getUserService(userId, serviceId);

    if (!userService) {
      return NextResponse.json(
        { error: "User service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userService);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user service" },
      { status: 500 }
    );
  }
}

// PUT /api/user-services/[userId]/[serviceId] (mettre à jour les permissions)
export async function PUT(
  request: Request,
  { params }: { params: { userId: string; serviceId: string } }
) {
  try {
    const userId = Number(params.userId);
    const serviceId = Number(params.serviceId);
    const permissions = await request.json();
    const updatedUserService = await updateUserServicePermissions(userId, serviceId, permissions);
    return NextResponse.json(updatedUserService);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update permissions" },
      { status: 500 }
    );
  }
}

// DELETE /api/user-services/[userId]/[serviceId] (désactiver un service)
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; serviceId: string } }
) {
  try {
    const userId = Number(params.userId);
    const serviceId = Number(params.serviceId);
    const deactivatedService = await deactivateUserService(userId, serviceId);
    return NextResponse.json(deactivatedService);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to deactivate service" },
      { status: 500 }
    );
  }
}
