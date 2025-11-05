import { NextResponse } from "next/server";
import { ServiceService } from "../services/service";

const serviceService = new ServiceService;

// GET /api/conciergerie
export async function GET(request: Request) {
  try {
    const services = await serviceService.getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conciergerie" },
      { status: 500 }
    );
  }
}