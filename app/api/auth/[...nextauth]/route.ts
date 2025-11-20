// auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/src/lib/db";
import { compare } from "bcryptjs";
import { NextAuthOptions, getServerSession } from "next-auth";
import { CustomUser } from "@/src/Components";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/src/Types/Utils/Param";
import { sign } from 'jsonwebtoken';
import { Role } from "@/src/Types/Users";

export const dynamicParams = true;
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
            return null;
          }

          const { rows } = await pool.query(
            "SELECT id, email, password_hash, name, role FROM users WHERE email = $1",
            [credentials.email.toLowerCase()]
          );

          const user = rows[0];
          if (!user) {
            return null;
          }

          const isValid = await compare(credentials.password, user.password_hash);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken: user.accessToken,
          };
        } catch (error) {
          return null; // Retournez null pour éviter les erreurs 500 non contrôlées
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: '1h' }
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as Role;
        session.accessToken = token.accessToken as string;
      };
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
        domain: process.env.NODE_ENV === "production" ? `${DOMAIN}` : undefined,
      },
    },
  },
  debug: process.env.NODE_ENV === "development", // Activez le debug uniquement en développement
};

const handler = NextAuth(authOptions);

// Export pour App Router
export { handler as GET, handler as POST };