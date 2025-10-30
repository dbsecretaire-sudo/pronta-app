// app/api/user/services/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/app/lib/db';
import { Session } from 'next-auth';

interface SubscriptionRequest {
  serviceId: string; // Typage du corps de la requête
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 1. Récupère et type le corps de la requête
    const { serviceId }: SubscriptionRequest = await request.json();

    // 2. Vérifie que serviceId est présent
    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId est requis" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // 3. Vérifie si l'abonnement existe déjà
    const checkQuery = `
      SELECT 1 FROM user_services
      WHERE user_id = $1 AND service_id = $2 AND is_active = true
    `;
    const checkRes = await pool.query(checkQuery, [userId, serviceId]);

    if (checkRes.rows.length > 0) {
      return NextResponse.json(
        { error: "L'utilisateur est déjà abonné à ce service" },
        { status: 409 }
      );
    }

    // 4. Ajoute l'abonnement
    const insertQuery = `
      INSERT INTO user_services (user_id, service_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(insertQuery, [userId, serviceId]);

    return NextResponse.json(
      { success: true, subscription: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'abonnement :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'abonnement" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions); // <-- Utilise getServerSession pour la cohérence
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const query = `
      SELECT s.id, s.name, s.description, s.route, s.icon
      FROM user_services us
      JOIN services s ON us.service_id = s.id
      WHERE us.user_id = $1
      ORDER BY s.name
    `;
    const { rows } = await pool.query(query, [userId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services" },
      { status: 500 }
    );
  }
}
