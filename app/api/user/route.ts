// app/api/user/route.ts
import { NextResponse } from 'next/server';
import {
  getAllUsers,
  createUser
} from './controller';

// GET /api/user
export async function GET(request: Request) {
  try {
    const users = await getAllUsers();
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
    const newUser = await createUser(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
