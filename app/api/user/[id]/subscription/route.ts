// app/api/user/[id]/subscription/route.ts
import { NextResponse } from 'next/server';
import { updateUserSubscription } from '../../controller';

import { z } from 'zod'; // Pour la validation (à installer: npm install zod)

// Schéma de validation pour les données d'abonnement
const subscriptionUpdateSchema = z.object({
  plan: z.string(),
  status: z.string().optional(),
  start_date: z.union([z.string().datetime(), z.date()]),
  end_date: z.union([z.string().datetime(), z.date()]),
  next_payment_date: z.union([z.string().datetime(), z.date()]),
});

// PUT /api/user/[id]/subscription/
export async function PUT(
  request: Request,
  { params }: { params: { id: string;} } // Plus besoin de Promise ici
) {
  try {
    const { id } = params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Validation des données d'entrée
    const body = await request.json();
    const updates = subscriptionUpdateSchema.parse(body);

    // Conversion des dates en ISOString si ce sont des objets Date
    const processedUpdates = {
      ...updates,
      ...(updates.start_date instanceof Date && { start_date: updates.start_date.toISOString() }),
      ...(updates.end_date instanceof Date && { end_date: updates.end_date.toISOString() }),
      ...(updates.next_payment_date instanceof Date && { next_payment_date: updates.next_payment_date.toISOString() })
    };

    const updatedUser = await updateUserSubscription(userId, processedUpdates.plan, processedUpdates);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user subscription:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user subscription" },
      { status: 500 }
    );
  }
}