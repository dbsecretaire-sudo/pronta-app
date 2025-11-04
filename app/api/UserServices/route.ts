import { NextResponse } from "next/server";
import { createUserService } from "./controller";

// POST /api/UserServices
export async function POST(request: Request) {
  try {
    const userServiceData = await request.json();
    console.log("Données reçues:", userServiceData); // <-- Ajoute cette ligne
    const newUserService = await createUserService(userServiceData);
    return NextResponse.json(newUserService, { status: 201 });
  } catch (error) {
    console.error("Erreur détaillée:", error); // <-- Ajoute cette ligne
    return NextResponse.json(
      { error: "Failed to create user service", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}