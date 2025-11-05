// app/api/services/[id]/route.ts
import { NextResponse } from 'next/server';
import { ServiceService } from '../service';

const serviceService = new ServiceService;

// GET /api/services/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await serviceService.getServiceById(Number(id));
    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceData = await request.json();
    const updatedService = await serviceService.updateService(Number(id), serviceData);
    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await serviceService.deleteService(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
