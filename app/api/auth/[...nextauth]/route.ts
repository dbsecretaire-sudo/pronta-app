// auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/app/lib/db";
import { compare } from "bcryptjs";
import { CustomUser} from "@/app/Types/Components/Session/index";

export const authOptions: import("next-auth").NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.error("Email ou mot de passe manquant");
          return null;
        }

        try {
          const { rows } = await pool.query(
            "SELECT id, email, password_hash, name FROM users WHERE email = $1",
            [credentials.email]
          );

          const user = rows[0];
          if (!user) {
            console.error("Utilisateur non trouvé");
            return null;
          }

          const isValid = await compare(credentials.password, user.password_hash);
          if (!isValid) {
            console.error("Mot de passe incorrect");
            return null;
          }

          console.log("Utilisateur autorisé :", user);
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Erreur lors de la vérification des identifiants:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        if (user) token.id = user.id;
        return token;
    },
    async session({ session, token }) {
        if (token.id) {
        session.user = {
            id: token.id as string,
            email: token.email as string,
            name: token.name as string,
        };

        session.auth = {
            userId: token.id as string,
            email: token.email as string,
            name: token.name as string,
        };
        }
        return session;
    },
    },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // ✅ Doit être true en production
        domain: process.env.NODE_ENV === "production" ? ".pronta.corsica" : undefined,
      },
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };