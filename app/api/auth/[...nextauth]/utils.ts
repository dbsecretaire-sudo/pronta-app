import { compare } from "bcryptjs";

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await compare(plainPassword, hashedPassword);
}

export function logAuthError(error: unknown): void {
  console.error("Erreur d'authentification:", error);
}