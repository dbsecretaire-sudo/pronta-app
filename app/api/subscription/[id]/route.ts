import { SubscriptionService } from '../service';
import { NextResponse } from 'next/server';
import { UpdateSubscriptionSchema } from "@/src/lib/schemas/subscription";
import { z } from "zod";

const subscriptionService = new SubscriptionService();

// PUT /api/subscription/[subscriptionId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Correction: params n'est pas une Promise ici
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Utilise le schéma existant pour valider les données
    const updates = UpdateSubscriptionSchema.parse(body);

    // Conversion des dates en ISOString si nécessaire
    const processedUpdates = {
      ...updates,
      start_date: updates.start_date instanceof Date
        ? updates.start_date.toISOString()
        : updates.start_date,
      end_date: updates.end_date instanceof Date
        ? updates.end_date.toISOString()
        : updates.end_date,
      next_payment_date: updates.next_payment_date instanceof Date
        ? updates.next_payment_date.toISOString()
        : updates.next_payment_date
    };

    // Appel au service pour mettre à jour l'abonnement
    const updatedSubscription = await subscriptionService.updateUserSubscription(
      Number(id),
      processedUpdates
    );

    return NextResponse.json(updatedSubscription);
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to update user subscription"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/subscription/[subscriptionId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Correction: params n'est pas une Promise
) {
  try {
    const { id } = await params;

    // Appel au service pour supprimer l'abonnement
    await subscriptionService.deleteUserSubscription(Number(id));

    return NextResponse.json(
      { success: true, message: "Subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to delete user subscription"
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    const subscriptions = await subscriptionService.getSubscriptionByUserId(userId);
    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to fetch subscriptions"
      },
      { status: 500 }
    );
  }
}