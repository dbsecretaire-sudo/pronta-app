// app/api/services/route.ts
import { NextResponse } from 'next/server';
import { ServiceService } from './service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const serviceService = new ServiceService;

// GET /api/services
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
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/services
export async function POST(request: Request) {

      const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

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
}
