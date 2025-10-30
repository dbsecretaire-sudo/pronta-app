import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/app/lib/db";
import { compare } from "bcryptjs";

// 1. Définis les types pour étendre la session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }
}

// 2. Configuration de NextAuth
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials: { email: string; password: string } | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 3. Récupère l'utilisateur dans la base de données
        const { rows } = await pool.query(
          "SELECT id, email, password_hash, name FROM users WHERE email = $1",
          [credentials.email]
        );
        const user = rows[0];

        if (!user) {
          return null;
        }

        // 4. Compare le mot de passe (assure-toi que bcryptjs est installé)
        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) {
          return null;
        }

        // 5. Retourne l'utilisateur si l'authentification réussit
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    // 6. Ajoute l'ID utilisateur au token JWT
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // 7. Ajoute l'ID utilisateur à la session
    async session({ session, token }: { session: any; token: any }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Page de login personnalisée
  },
};

// 8. Exporte les handlers pour GET et POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
