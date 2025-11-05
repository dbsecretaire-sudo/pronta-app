// app/api/UserServices/[userId]/[serviceId]/route.ts
import { NextResponse } from 'next/server';
import { UserServiceService } from '../../service';

const userServiceService = new UserServiceService;

// GET /api/UserServices/[userId]/[serviceId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string; serviceId: string }> }
) {
  try {
    const { userId, serviceId } = await params; // ✅ Utilisez await pour obtenir les valeurs
    const userService = await userServiceService.getUserService(Number(userId), Number(serviceId));
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

// PUT /api/UserServices/[userId]/[serviceId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string; serviceId: string }> }
) {
  try {
    const { userId, serviceId } = await params; // ✅ Utilisez await pour obtenir les valeurs
    const permissions = await request.json();
    const updatedUserService = await userServiceService.updateUserServicePermissions(
      Number(userId),
      Number(serviceId),
      permissions
    );
    return NextResponse.json(updatedUserService);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update permissions" },
      { status: 500 }
    );
  }
}


