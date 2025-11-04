import { NextResponse } from "next/server";
import { getAllServices } from "../services/controller";

// GET /api/conciergerie
export async function GET(request: Request) {
  try {
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conciergerie" },
      { status: 500 }
    );
  }
}