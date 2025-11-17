import { NextRequest, NextResponse } from "next/server";
import { ServiceService } from "../services/service";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { withAuth } from "@/src/utils/withAuth";
const API_URL = process.env.NEXTAUTH_URL
const serviceService = new ServiceService;

// GET /api/conciergerie
export async function GET(request: NextRequest,) {

  return withAuth(request, async (session) => { 

    try {
      const services = await serviceService.getAllServices();
      return NextResponse.json(services);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch conciergerie" },
        { status: 500 }
      );
    }
  });
}