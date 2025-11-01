import { NextResponse } from 'next/server';
import { loginController } from './controller';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Récupère le body de la requête
    const result = await loginController(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 401 }
    );
  }
}