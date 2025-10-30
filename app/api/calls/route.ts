// app/api/calls/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { Call } from '@/app/models/Call';

// Endpoint GET : Récupérer les appels (avec filtrage par nom/téléphone)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const byName = searchParams.get('byName') || '';
  const byPhone = searchParams.get('byPhone') || '';

  if (!userId) {
    return NextResponse.json(
      { error: "userId est requis" },
      { status: 400 }
    );
  }

  try {
    let query = 'SELECT * FROM calls WHERE user_id = $1';
    const params: any[] = [userId];

    if (byName) {
      query += ` AND name ILIKE $${params.length + 1}`;
      params.push(`%${byName}%`);
    }

    if (byPhone) {
      query += ` AND phone ILIKE $${params.length + 1}`;
      params.push(`%${byPhone}%`);
    }

    query += ' ORDER BY date DESC LIMIT 50';

    const { rows } = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des appels :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des appels" },
      { status: 500 }
    );
  }
}

// Endpoint POST : Créer un nouvel appel
export async function POST(request: Request) {
  try {
    const { userId, phone, name, type, summary, duration } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO calls (user_id, name, phone, date, type, summary, duration)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6)
      RETURNING *
    `;
    const values = [userId, name, phone, type, summary, duration];
    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'appel :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'appel" },
      { status: 500 }
    );
  }
}
