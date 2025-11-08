// app/api/user/[id]/subscription/route.ts
import { NextResponse } from 'next/server';
import { SubscriptionService } from './service';
import { z } from 'zod';
import { CreateSubscriptionSchema } from "@/src/lib/schemas/subscription"; // Import du schéma existant

const subscriptionService = new SubscriptionService();

// POST /api/user/[id]/subscription/ - Pour créer un nouvel abonnement
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Utilise le schéma existant pour la validation
    const subscriptionData = CreateSubscriptionSchema.parse({
      ...body,
      user_id: Number(body.user_id), // Assure-toi que c'est un number
      status: body.status || 'active' // Valeur par défaut
    });

    // Conversion des dates en ISOString si nécessaire
    const processedData = {
      ...subscriptionData,
      start_date: subscriptionData.start_date instanceof Date
        ? subscriptionData.start_date.toISOString()
        : subscriptionData.start_date || new Date().toISOString(),
      end_date: subscriptionData.end_date instanceof Date
        ? subscriptionData.end_date.toISOString()
        : subscriptionData.end_date,
      next_payment_date: subscriptionData.next_payment_date instanceof Date
        ? subscriptionData.next_payment_date.toISOString()
        : subscriptionData.next_payment_date
    };

    // Appel au service pour créer un nouvel abonnement
    const newSubscription = await subscriptionService.createUserSubscription(
      processedData.user_id,
      processedData
    );

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    console.error("Error creating user subscription:", error);

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
          : "Failed to create user subscription"
      },
      { status: 500 }
    );
  }
}

// GET /api/user/subscription - Pour récupérer les abonnements d'un utilisateur
export async function GET() {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
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
