import { getSubscriptionByUserId, getSubscriptionByUserIdAndPlan } from '@/app/api/subscription/controller';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> } // Typage correct pour Next.js
) {
  const resolvedParams = await params; // Résoudre la Promise
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');

  try {
    const userId = Number(resolvedParams.userId); // Utiliser resolvedParams
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "L'ID de l'utilisateur est invalide" },
        { status: 400 }
      );
    }

    const subscriptions = plan
      ? await getSubscriptionByUserIdAndPlan(userId, plan)
      : await getSubscriptionByUserId(userId);

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Erreur dans GET /api/subscription/[userId]:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des abonnements" },
      { status: 500 }
    );
  }
}