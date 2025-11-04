import { NextResponse } from "next/server";
import { createUserService } from "./controller";

// POST /api/UserServices
export async function POST(request: Request) {
  try {
    const userServiceData = await request.json();
    const newUser = await createUserService(userServiceData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
