import { NextResponse } from "next/server";
import { ServiceService } from "../services/service";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const serviceService = new ServiceService;

// GET /api/conciergerie
export async function GET(request: Request) {

      const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));  
    }  

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