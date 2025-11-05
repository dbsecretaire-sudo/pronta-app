// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { UserService} from './service';

const userService = new UserService;

// GET /api/user
export async function GET(request: Request) {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/user
export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const newUser = await userService.createUser(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
