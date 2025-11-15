// app/api/user/[id]/subscription/route.ts
import { NextResponse } from 'next/server';
import { SubscriptionService } from './service';
import { z } from 'zod';
import { CreateSubscriptionSchema } from "@/src/lib/schemas/subscription"; // Import du schéma existant
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const subscriptionService = new SubscriptionService();

// POST /api/user/[id]/subscription/ - Pour créer un nouvel abonnement
export async function POST(request: Request) {

    const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  try {
    const body = await request.json();

    const toISODate = (date: string | Date | null | undefined): string | null => {
      if (!date) return null;
      if (date instanceof Date) return date.toISOString();
      if (typeof date === 'string') {
        // Si la date est au format "YYYY-MM-DD", ajoute le timezone
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return new Date(`${date}T00:00:00Z`).toISOString();
        }
        // Si la date est déjà au format ISO, retourne-la telle quelle
        return date;
      }
      return null;
    };

    // Utilise le schéma existant pour la validation
    const dataToValidate = {
      ...body,
      user_id: Number(body.user_id),
      status: body.status || 'active',
      start_date: toISODate(body.start_date) || new Date().toISOString(),
      end_date: toISODate(body.end_date),
      next_payment_date: toISODate(body.next_payment_date),
    };
    // Valide les données avec le schéma
    const subscriptionData = CreateSubscriptionSchema.parse(dataToValidate);

    // Pas besoin de conversion supplémentaire, le schéma Zod a déjà validé les dates
    const processedData = { ...subscriptionData };

    // Appel au service
    const newSubscription = await subscriptionService.createUserSubscription(
      body.user_id,
      processedData
    );
    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    console.error("Error details:", error);
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
export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
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
