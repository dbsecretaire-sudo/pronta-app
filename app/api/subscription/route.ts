// app/api/user/[id]/subscription/route.ts
import { NextResponse } from 'next/server';
import { SubscriptionService } from './service';
import { z } from 'zod';

const subscribedServices = new SubscriptionService;

// POST /api/user/[id]/subscription/ - Pour créer un nouvel abonnement
export async function POST(
  request: Request,
) {
  try {

    // Schéma de validation pour la création d'abonnement
    const subscriptionCreateSchema = z.object({
      user_id: z.number(),
      service_id: z.number(),
      status: z.string().optional(),
      start_date: z.union([z.string().datetime(), z.date()]).optional(),
      end_date: z.union([z.string().datetime(), z.date()]).optional(),
      next_payment_date: z.union([z.string().datetime(), z.date()]).optional(),
    });

    const body = await request.json();
    const subscriptionData = subscriptionCreateSchema.parse(body);

    // Conversion des dates en ISOString si ce sont des objets Date
    const processedData = {
      ...subscriptionData,
      ...(subscriptionData.start_date instanceof Date && { start_date: subscriptionData.start_date.toISOString() }),
      ...(subscriptionData.end_date instanceof Date && { end_date: subscriptionData.end_date.toISOString() }),
      ...(subscriptionData.next_payment_date instanceof Date && { next_payment_date: subscriptionData.next_payment_date.toISOString() }),
      status: subscriptionData.status || 'active',
      start_date: subscriptionData.start_date || new Date().toISOString()
    };

    // Appel au service pour créer un nouvel abonnement
    // Note: Vous devrez implémenter cette méthode dans votre controller
    const newSubscription = await subscribedServices.createUserSubscription(processedData.user_id, processedData);

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
      { error: error instanceof Error ? error.message : "Failed to create user subscription" },
      { status: 500 }
    );
  }
}

// GET /api/user
export async function GET(request: Request) {
  try {
    const subscriptions = await subscribedServices.getAllSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
