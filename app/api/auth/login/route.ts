import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/app/lib/db';

export async function POST(request: Request) {
  console.log("Route API /auth/login appelée"); // Log de début
  const { email, password } = await request.json();
  console.log("Tentative de connexion pour :", email); // Log de l'email

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      console.log("Utilisateur non trouvé"); // Log si l'utilisateur n'existe pas
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log("Mot de passe incorrect"); // Log si le mot de passe est incorrect
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre_cle_secrete', { expiresIn: '1h' });
    console.log("Token généré avec succès"); // Log si le token est généré
    return NextResponse.json({ token });
  } catch (err) {
    console.error("Erreur serveur :", err); // Log de l'erreur serveur
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}