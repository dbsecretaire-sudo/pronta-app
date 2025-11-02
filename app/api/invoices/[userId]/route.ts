// app/api/invoices/route.ts
import { NextResponse } from 'next/server';
import pool from "@/src/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Dans App Router, les paramètres dynamiques sont dans l'URL
    // Ex: /api/invoices/123 -> userId = "123"
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || params.userId;

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT id, date, amount, status, pdf_url
      FROM invoices
      WHERE user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    );
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
