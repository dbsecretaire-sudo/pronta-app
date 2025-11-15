// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { UserService} from '../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const userService = new UserService;

// GET /api/user
export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

  try {
    const users = await userService.getAllUsersName();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
