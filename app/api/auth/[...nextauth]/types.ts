import { User } from "@/app/Types/Users/index";

export {}; 

declare module "next-auth" {
  interface Session {
    user: Omit<User, 'id' | "role" | "password_hash" | "created_at"> & { id: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Omit<User, 'id' | "role" | "password_hash"> {
    id: string;
  }
}