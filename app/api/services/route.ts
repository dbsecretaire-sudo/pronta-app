// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ServiceService } from './service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const serviceService = new ServiceService;

// GET /api/services
export async function GET(request: NextRequest) {

  return withAuth(request, async (session) => {

    try {
      const services = await serviceService.getAllServices();
      return NextResponse.json(services);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 }
      );
    }
  });
}

// POST /api/services
export async function POST(request: NextRequest) {

  return withAuth(request, async (session) => {

    try {
      const serviceData = await request.json();
      const newService = await serviceService.createService(serviceData);
      return NextResponse.json(newService, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: 500 }
      );
    }
  });
}
