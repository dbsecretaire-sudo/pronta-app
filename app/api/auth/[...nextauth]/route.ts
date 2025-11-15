// auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/src/lib/db";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { CustomUser } from "@/src/Components";

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
          return null; // Retournez null pour éviter les erreurs 500 non contrôlées
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
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
        domain: process.env.NODE_ENV === "production" ? `.${DOMAIN}` : undefined,
      },
    },
  },
  debug: true, // Activez le debug uniquement en développement
};

const handler = NextAuth(authOptions);

// Export pour App Router
export { handler as GET, handler as POST };
