// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si le client existe et est lié à des factures
    const checkQuery = `
      SELECT 1 FROM invoices WHERE client_id = $1 LIMIT 1
    `;
    const checkRes = await pool.query(checkQuery, [params.id]);

    if (checkRes.rows.length > 0) {
      return NextResponse.json(
        { error: "Ce client est lié à des factures et ne peut pas être supprimé" },
        { status: 400 }
      );
    }

    // Supprimer le client
    const deleteQuery = 'DELETE FROM clients WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(deleteQuery, [params.id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du client" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, phone, address, company } = await request.json();

    // Validation basique
    if (!name || !email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont obligatoires" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE clients
      SET name = $1, email = $2, phone = $3, address = $4, company = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const { rows } = await pool.query(query, [name, email, phone, address, company, params.id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === '23505') {
      return NextResponse.json(
        { error: "Un client avec cet email existe déjà" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client" },
      { status: 500 }
    );
  }
}