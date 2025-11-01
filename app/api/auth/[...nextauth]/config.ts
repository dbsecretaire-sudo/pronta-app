import { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import { compare } from "bcryptjs";

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mot de passe", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email et mot de passe requis");
      }

      try {
        const { rows } = await pool.query(
          "SELECT id, email, password_hash, name FROM users WHERE email = $1",
          [credentials.email]
        );

        const user = rows[0];
        if (!user) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        return null;
      }
    },
  }),
];

const callbacks = {
  async jwt({ token, user } : {token: NextAuthJWT; user?: any }): Promise<NextAuthJWT> {
    if (user) {
      token.id = user.id;
      token.email = user.email || '';
      token.name = user.name || '';
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: NextAuthJWT }): Promise<Session> {
    if (token.id) {
      session.user = {
        id: token.id,
        email: token.email as string,
        name: token.name as string,
      };
    }
    return session;
  },
};

export const authOptions: NextAuthOptions = {
  providers,
  callbacks,
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".pronta.corsica" : undefined,
      },
    },
  },
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
