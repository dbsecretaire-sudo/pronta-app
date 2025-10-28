// app/api/auth/login/route.ts
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
      console.log("Utilisateur non trouvé");
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const user = rows[0];
    console.log("Mot de passe hashé en base :", user.password_hash); // Log du hash en base
    console.log("Mot de passe saisi :", password); // Log du mot de passe saisi

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Le mot de passe correspond ?", passwordMatch); // Log du résultat de la comparaison

    if (!passwordMatch) {
      console.log("Mot de passe incorrect");
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre_cle_secrete', { expiresIn: '1h' });
    return NextResponse.json({ token });
  } catch (err) {
    console.error("Erreur serveur :", err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
