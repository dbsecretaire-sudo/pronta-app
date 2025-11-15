// app/api/user/[id]/service/route.ts
import { NextResponse } from 'next/server';
import { UserService } from '../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const userService = new UserService;

// GET /api/user/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

      const session = await getServerSession(authOptions);
    if (!session) {
       return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
    }

  try {
    const { id } = await params;
    const userRole = await userService.getUserServices(Number(id));

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