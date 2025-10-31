// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { Params } from '@/models/PropsAdditionnals';

// DELETE /api/clients/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id:string }> } // ✅ Typage explicite pour Next.js 16
) {
  try {
    const { id } = await params; // ✅ Pas besoin d'attendre, params est déjà un objet

    // Vérifie si le client est lié à des factures
    const checkQuery = 'SELECT 1 FROM invoices WHERE client_id = $1 LIMIT 1';
    const checkRes = await pool.query(checkQuery, [id]);

    if (checkRes.rows.length > 0) {
      return NextResponse.json(
        { error: "Ce client est lié à des factures et ne peut pas être supprimé" },
        { status: 400 }
      );
    }

    // Supprime le client
    const deleteQuery = 'DELETE FROM clients WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(deleteQuery, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Erreur DELETE :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du client" },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Utilise `Promise<{ id: string }>`
) {
  try {
    const { id } = await params; // ✅ Utilise `await` pour obtenir la valeur de `params`
    const { name, email, phone, address, company } = await request.json();

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

    const { rows } = await pool.query(query, [name, email, phone, address, company, id]);

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

    console.error("Erreur PUT :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client" },
      { status: 500 }
    );
  }
}
