// app/api/invoices/[userId]/route.ts
import { NextResponse } from 'next/server';
import pool from "@/src/lib/db";
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const result = await client.query(
      `SELECT id, date, amount, status, pdf_url
       FROM invoices
       WHERE user_id = $1
       ORDER BY date DESC`,
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

// POST /api/invoices/[userId]
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Validation des données
    if (!body.date || !body.amount) {
      return NextResponse.json(
        { error: "Date and amount are required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO invoices
       (user_id, date, amount, status, pdf_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        new Date(body.date),
        body.amount,
        body.status || 'pending',
        body.pdf_url || null
      ]
    );
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
