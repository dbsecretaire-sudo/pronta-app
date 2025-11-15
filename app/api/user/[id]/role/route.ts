// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { UserService } from '../../service';

const userService = new UserService;

// GET /api/user/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const userRole = await userService.getRoleByUserId(Number(id));

    if (!userRole) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userRole);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch user, ${error}` },
      { status: 500 }
    );
  }
}