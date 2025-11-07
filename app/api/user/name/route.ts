// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { UserService} from '../service';

const userService = new UserService;

// GET /api/user
export async function GET(request: Request) {
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
