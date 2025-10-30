// app/api/invoices/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    const userId = 1; // À remplacer par l'ID de l'utilisateur connecté

    const query = `
      SELECT i.id, i.client_name as "clientName", i.amount, i.status, i.due_date as "dueDate"
      FROM invoices i
      WHERE i.user_id = $1
      ORDER BY i.due_date DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 }
    );
  }
}
