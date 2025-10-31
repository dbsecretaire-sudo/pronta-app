import jwt from 'jsonwebtoken';
import { JwtPayload } from './types';

export function generateToken(userId: number): string {
  return jwt.sign(
    { userId } as JwtPayload,
    process.env.JWT_SECRET || 'votre_cle_secrete',
    { expiresIn: '1h' }
  );
}

export function handleError(error: unknown): { message: string; status: number } {
  console.error("Erreur serveur :", error);
  return {
    message: 'Erreur serveur',
    status: 500,
  };
}
