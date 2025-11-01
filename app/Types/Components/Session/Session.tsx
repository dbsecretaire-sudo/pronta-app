import { User } from "@/app/Types/Users/index";

export  interface Session {
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface CustomUser extends Omit<User, 'id' | "password_hash" | "role" | "payment_method" | "created_at" | "subsciption_plan" | "subscription_end_date" > {
  id: string; // Redéfini en string
  email: string;
  name: string;
}
