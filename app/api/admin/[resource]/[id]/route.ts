import { NextResponse } from 'next/server';
import pool from '@/src/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string, id: string }> }
) {
  const { resource, id } = await params;
  try {
    const result = await pool.query(`SELECT * FROM ${resource} WHERE id = $1`, [id]);
    return NextResponse.json(result.rows[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}
