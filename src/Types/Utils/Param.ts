import { User } from "@/src/lib/schemas/users";
import { Session } from "next-auth";
import { sign } from 'jsonwebtoken';
export type { User };
export interface Params {
  id: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  session: Session | null;
  role: string | null;
}

export function generateAccessToken(user: any) {
  return sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '1h' }
  );
}