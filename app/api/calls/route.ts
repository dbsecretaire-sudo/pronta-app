// app/api/calls/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// Définissez le type pour un appel
interface Call {
  id: number;
  phone: string;
  name: string;
  date: Date;
  duration: number;
  status: string;
}

// Endpoint GET : Récupérer les appels (avec filtrage par nom/téléphone)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const byName = searchParams.get('byName') || '';
  const byPhone = searchParams.get('byPhone') || '';

  try {
    let query = 'SELECT * FROM calls WHERE 1=1';
    const params: any[] = [];

    if (byName) {
      query += ' AND name ILIKE $1';
      params.push(`%${byName}%`);
    }

    if (byPhone) {
      query += ` AND phone ILIKE $${params.length + 1}`;
      params.push(`%${byPhone}%`);
    }

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
    const { phone, name, duration, status } = await request.json();

    const query = `
      INSERT INTO calls (phone, name, date, duration, status)
      VALUES ($1, $2, NOW(), $3, $4)
      RETURNING *
    `;
    const values = [phone, name, duration, status];

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
