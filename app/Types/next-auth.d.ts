import { DefaultSession } from "next-auth";

export {};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
    } & DefaultSession["user"];
    auth?: {  // Ajoute auth en optionnel
      userId: string;
      email: string;
      name?: string;
      // Ajoute d'autres champs si nécessaire
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Omit<User, 'id' | "role" | "password_hash"> {
    id: string;
  }
}