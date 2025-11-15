import { SubscriptionService } from '../../service';
import { NextResponse } from 'next/server';

const subscriptionService = new SubscriptionService;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> } // Typage correct pour Next.js
) {
  const resolvedParams = await params; // Résoudre la Promise
  const { searchParams } = new URL(request.url);
  const service_id = searchParams.get('service_id');

  try {
    const userId = Number(resolvedParams.userId); // Utiliser resolvedParams
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "L'ID de l'utilisateur est invalide" },
        { status: 400 }
      );
    }

    const subscriptions = Number(service_id)
      ? await subscriptionService.getSubscriptionByUserIdAndService(userId, Number(service_id))
      : await subscriptionService.getSubscriptionByUserId(userId);

    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: "Échec de la récupération des abonnements" },
      { status: 500 }
    );
  }
}