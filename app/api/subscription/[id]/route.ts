import { SubscriptionService } from '../service';
import { NextResponse } from 'next/server';
import { UpdateSubscriptionSchema } from "@/src/lib/schemas/subscription";
import { z } from "zod";

const subscriptionService = new SubscriptionService();

// PUT /api/subscription/[subscriptionId]
// PUT /api/subscription/[subscriptionId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Attend la résolution de la Promise pour accéder à params.id
    const { id } = await params;
    const body = await request.json();
    console.log("Received body:", body);

    // Vérifie que l'ID est un nombre valide
    const subscriptionId = Number(id);
    if (isNaN(subscriptionId)) {
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 }
      );
    }

    // Fonction pour convertir les dates en ISO datetime
    const toISODate = (date: string | Date | null | undefined): string | null => {
      if (!date) return null;
      if (date instanceof Date) return date.toISOString();
      if (typeof date === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return new Date(`${date}T00:00:00Z`).toISOString();
        }
        return date;
      }
      return null;
    };

    // Prépare les données pour la validation
    const dataToValidate = {
      ...body,
      user_id: body.user_id ? Number(body.user_id) : undefined,
      status: body.status || 'active',
      start_date: toISODate(body.start_date) || new Date().toISOString(),
      end_date: toISODate(body.end_date),
      next_payment_date: toISODate(body.next_payment_date),
    };

    // Vérifie que user_id est valide si fourni
    if (dataToValidate.user_id !== undefined && isNaN(dataToValidate.user_id)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Valide les données avec le schéma
    const subscriptionData = UpdateSubscriptionSchema.parse(dataToValidate);

    // Met à jour la subscription
    const updatedSubscription = await subscriptionService.updateUserSubscription(
      subscriptionId,
      subscriptionData
    );

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
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