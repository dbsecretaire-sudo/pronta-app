// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const userService = new UserService;

// GET /api/user/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const user = await userService.getUserById(Number(id));

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch user, ${error}` },
        { status: 500 }
      );
    }
  });
}

// PUT /api/user/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const userData = await request.json();
      const updatedUser = await userService.updateUser(Number(id), userData);
      return NextResponse.json(updatedUser);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/user/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

    const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 } // Code HTTP pour "Unauthorized"
    );  
  }

  try {
    const { id } = await params;
    await userService.deleteUser(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
