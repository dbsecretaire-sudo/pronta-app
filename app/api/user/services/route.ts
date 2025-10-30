// app/api/user/services/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, serviceId } = await request.json();

    // Vérifier si l'utilisateur est déjà abonné
    const checkQuery = `
      SELECT 1 FROM user_services
      WHERE user_id = $1 AND service_id = $2
    `;
    const checkRes = await pool.query(checkQuery, [userId, serviceId]);

    if (checkRes.rows.length > 0) {
      return NextResponse.json(
        { error: "L'utilisateur est déjà abonné à ce service" },
        { status: 400 }
      );
    }

    // Ajouter l'abonnement
    const insertQuery = `
      INSERT INTO user_services (user_id, service_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(insertQuery, [userId, serviceId]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'abonnement au service" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = 1; // À remplacer par l'ID de l'utilisateur connecté

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
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services" },
      { status: 500 }
    );
  }
}