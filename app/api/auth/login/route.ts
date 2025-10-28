import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/app/lib/db';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre_cle_secrete', { expiresIn: '1h' });

    // Définir le cookie dans la réponse
    const response = NextResponse.json({ token });
    response.cookies.set("token", token, {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: process.env.NODE_ENV === 'production', // Active le cookie sécurisé en production
      maxAge: 3600, // Expire dans 1 heure
      path: '/', // Accessible sur tout le site
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}