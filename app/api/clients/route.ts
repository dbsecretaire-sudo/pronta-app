// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const offset = (page - 1) * limit;

  try {
    // Compter le nombre total de clients (pour la pagination)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM clients
      WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
    `;
    const countRes = await pool.query(countQuery, [`%${search}%`]);
    const total = parseInt(countRes.rows[0].total);

    // Récupérer les clients paginés
    const query = `
      SELECT id, name, email, phone, address, company, created_at as "createdAt", updated_at as "updatedAt"
      FROM clients
      WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await pool.query(query, [`%${search}%`, limit, offset]);

    return NextResponse.json({
      clients: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, address, company } = await request.json();

    // Validation basique
    if (!name || !email) {
      return NextResponse.json(
        { err: "Le nom et l'email sont obligatoires" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO clients (name, email, phone, address, company)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [name, email, phone, address, company]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === '23505') { // Code d'erreur pour violation de contrainte unique
      return NextResponse.json(
        { error: "Un client avec cet email existe déjà" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la création du client" },
      { status: 500 }
    );
  }
}
