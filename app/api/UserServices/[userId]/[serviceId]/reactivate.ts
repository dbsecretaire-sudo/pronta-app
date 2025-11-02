import { NextResponse } from 'next/server';
import { reactivateUserService } from '../../controller';

export async function PATCH(
  request: Request,
{ params }: { params: Promise<{ userId: string; serviceId: string }> }
) {
try {
    const { userId, serviceId } = await params; // ✅ Utilisez await pour obtenir les valeurs
    const deactivatedService = await reactivateUserService(Number(userId), Number(serviceId));
    return NextResponse.json(deactivatedService);
} catch (error) {
    return NextResponse.json(
    { error: error instanceof Error ? error.message : "Failed to deactivate service" },
    { status: 500 }
    );
}
}
