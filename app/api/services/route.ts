// app/api/services/route.ts
import { NextResponse } from 'next/server';
import  pool  from '@/app/lib/db';

export async function GET() {
  try {
    const query = 'SELECT id, name, description, route, icon FROM services ORDER BY name';
    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services from app/api/services/route.ts" },
      { status: 500 }
    );
  }
}


