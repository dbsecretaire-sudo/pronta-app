// app/api/services/route.ts
import { NextResponse } from 'next/server';
import { ServiceService } from './service';

const serviceService = new ServiceService;

// GET /api/services
export async function GET(request: Request) {
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
