// app/api/UserServices/[userId]/[serviceId]/route.ts
import { NextResponse } from 'next/server';
import { UserService } from '../../service';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const userService = new UserService;

// GET /api/User/[id]/[serviceId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {

    const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

  try {
    const { id, serviceId } = await params; // ✅ Utilisez await pour obtenir les valeurs
    const user = await userService.getUserById(Number(id));
    if (!user) {
      return NextResponse.json(
        { error: "User service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user service" },
      { status: 500 }
    );
  }
}

// PUT /api/User/[id]/[serviceId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {

    const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

  try {
    const { id, serviceId } = await params; // ✅ Utilisez await pour obtenir les valeurs
    const permissions = await request.json();
    const updatedUser = await userService.updateUser( Number(id), permissions);
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update permissions" },
      { status: 500 }
    );
  }
}

