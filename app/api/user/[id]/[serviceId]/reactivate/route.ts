import { NextResponse } from 'next/server';
import { UserService } from '../../../service';

const userService = new UserService;

export async function POST(
  request: Request,
{ params }: { params: Promise<{ id: string; serviceId: string }> }
) {
try {
    const { id, serviceId } = await params; // ✅ Utilisez await pour obtenir les valeurs
    const deactivatedService = await userService.reactivateUserService(Number(id), Number(serviceId));
    return NextResponse.json(deactivatedService);
} catch (error) {
    return NextResponse.json(
    { error: error instanceof Error ? error.message : "Failed to deactivate service" },
    { status: 500 }
    );
}
}
