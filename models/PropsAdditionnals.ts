import { User } from "next-auth";

export interface CustomUser extends User {
  id: string;
  email: string;
  name: string;
}

export interface Params {
  id: string;
}

export  interface Session {
    user: {
        id: string;
        email: string;
        name: string;
    };
}