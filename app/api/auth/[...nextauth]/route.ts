// auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/src/lib/db";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { CustomUser } from "@/src/Components";
import { NextResponse } from "next/server";

const DOMAIN = process.env.DOMAIN;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Email ou mot de passe manquant");
            return null;
          }

          const { rows } = await pool.query(
            "SELECT id, email, password_hash, name FROM users WHERE email = $1",
            [credentials.email.toLowerCase()]
          );

          const user = rows[0];
          if (!user) {
            console.error("Utilisateur non trouvé pour l'email:", credentials.email);
            return null;
          }

          const isValid = await compare(credentials.password, user.password_hash);
          if (!isValid) {
            console.error("Mot de passe incorrect pour l'utilisateur:", user.email);
            return null;
          }

          console.log("Utilisateur autorisé:", user.email);
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Erreur lors de l'autorisation:", error);
          throw new Error("Internal server error"); // Assurez-vous que cette erreur est correctement gérée
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Ajoutez d'autres claims JWT ici si nécessaire
        // Ex: token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          // Ajoutez d'autres champs ici si nécessaire
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Page de connexion personnalisée
    error: "/login",  // Page d'erreur (optionnel)
  },
  session: {
    strategy: "jwt", // Stratégie JWT pour les sessions
    maxAge: 30 * 60, // Durée de vie de la session (30 minutes)
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? `.${DOMAIN}` : undefined, // Notez le `.` avant le domaine
      },
    },
  },
  // debug: process.env.NODE_ENV !== "production", // Désactivez le debug en production
  debug: true,
};

const handler = NextAuth(authOptions);
const handleAuth = (req: Request) => {
  try {
    return handler(req);
  } catch (error) {
    console.error("Erreur dans NextAuth:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
export { handleAuth as GET, handleAuth as POST };
