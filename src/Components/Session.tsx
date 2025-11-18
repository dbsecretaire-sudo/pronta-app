import { User } from "@/src/Types/Users/index";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    accessToken: string | null;
  }

  interface Session {
    accessToken: string | null;
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string,
    } & DefaultSession["user"];
    auth?: {
      userId: string;
      email: string;
      name?: string;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
  }
}

export interface CustomUser extends Omit<User, 'id' | "password_hash" | "role" | "payment_method" | "created_at" | "subscription" | "can_write" | "can_delete" | "service_ids"> {
  id: string; // Redéfini en string
  email: string;
  name: string;
  accessToken: string | null;
}
