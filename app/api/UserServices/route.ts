import { NextResponse } from 'next/server';
import { deactivateUserService } from './controller';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { serviceId } = await request.json();
    const userId = Number(id);

    const result = await deactivateUserService(userId, serviceId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la désactivation du service:", error);
    return NextResponse.json(
      { error: 'Erreur lors de la désactivation du service' },
      { status: 500 }
    );
  }
}