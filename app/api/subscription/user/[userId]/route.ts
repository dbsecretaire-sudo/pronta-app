import { getSubscriptionByUserId, getSubscriptionByUserIdAndPlan } from '@/app/api/subscription/controller';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan'); // Récupère le paramètre `plan` (ou `null` s'il n'existe pas)

  try {
    const userId = Number(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "L'ID de l'utilisateur est invalide" },
        { status: 400 }
      );
    }

    // Cas 1 : Si un `plan` est spécifié, filtre par plan
    // Cas 2 : Sinon, retourne tous les abonnements de l'utilisateur
    const subscriptions = plan
      ? await getSubscriptionByUserIdAndPlan(userId, plan)
      : await getSubscriptionByUserId(userId);

    return NextResponse.json(subscriptions); // Toujours un tableau (même vide)
  } catch (error) {
    console.error("Erreur dans GET /api/subscription/[userId]:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des abonnements" },
      { status: 500 }
    );
  }
}