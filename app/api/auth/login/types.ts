import { z } from 'zod';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  userId: number;
}

export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type ValidatedLoginCredentials = z.infer<typeof LoginCredentialsSchema>;