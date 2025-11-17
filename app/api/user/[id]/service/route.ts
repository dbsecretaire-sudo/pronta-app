// app/api/user/[id]/service/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
  });
}