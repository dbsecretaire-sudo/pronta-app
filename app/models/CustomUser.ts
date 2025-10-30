import { User } from "next-auth";

export interface CustomUser extends User {
  id: string;
  email: string;
  name: string;
}
