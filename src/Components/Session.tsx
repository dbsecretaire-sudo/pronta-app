import { User } from "@/src/Types/Users/index";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string | null;
    } & DefaultSession["user"];
    auth?: {
      userId: string;
      email: string;
      name?: string;
      role? : string | null
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    role: string
  }
}

export interface CustomUser extends Omit<User, 'id' | "password_hash" | "role" | "payment_method" | "created_at" | "subscription" > {
  id: string; // Redéfini en string
  email: string;
  name: string;
  role: string;
}
