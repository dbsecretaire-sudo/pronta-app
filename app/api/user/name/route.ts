// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService} from '../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const userService = new UserService;

// GET /api/user
export async function GET(request: NextRequest,) {

  return withAuth(request, async (session) => {

    try {
      const users = await userService.getAllUsersName();
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }
  });
}
