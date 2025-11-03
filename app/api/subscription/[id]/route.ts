import { updateUserSubscription, createUserSubscription, deleteUserSubscription } from '../controller';
import { NextResponse } from 'next/server';

import { z } from 'zod';

// Schéma de validation pour les données d'abonnement
const subscriptionUpdateSchema = z.object({
  id : z.number(),
  user_id: z.number(),
  plan: z.string().optional(),
  status: z.string().optional(),
  start_date: z.union([z.string().datetime(), z.date()]).optional(),
  end_date: z.union([z.string().datetime(), z.date()]).optional(),
  next_payment_date: z.union([z.string().datetime(), z.date()]).optional(),
});

// PUT /api/user/[id]/subscription/[subscriptionId]
export async function PUT(
  request: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const updates = subscriptionUpdateSchema.parse(body);

    // Conversion des dates en ISOString si ce sont des objets Date
    const processedUpdates = {
      ...updates,
      ...(updates.start_date instanceof Date && { start_date: updates.start_date.toISOString() }),
      ...(updates.end_date instanceof Date && { end_date: updates.end_date.toISOString() }),
      ...(updates.next_payment_date instanceof Date && { next_payment_date: updates.next_payment_date.toISOString() })
    };

    // Appel au service pour mettre à jour l'abonnement
    const updatedSubscription = await updateUserSubscription(Number(id), processedUpdates);

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating user subscription:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user subscription" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscription/[subscriptionId]
export async function DELETE(
  request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    // Appel au service pour supprimer l'abonnement
    // Note: Vous devrez implémenter cette méthode dans votre controller
    await deleteUserSubscription(Number(id));

    return NextResponse.json(
      { success: true, message: "Subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user subscription:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user subscription" },
      { status: 500 }
    );
  }
}
