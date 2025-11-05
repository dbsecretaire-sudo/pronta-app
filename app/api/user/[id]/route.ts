// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { UserService } from '../service';

const userService = new UserService;

// GET /api/user/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

// PUT /api/user/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

// DELETE /api/user/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
