import { DefaultSession } from "next-auth";

export {};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Omit<User, 'id' | "role" | "password_hash"> {
    id: string;
  }
}