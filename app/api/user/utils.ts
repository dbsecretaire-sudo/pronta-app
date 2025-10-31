import { CreateUser, Role } from "@/Types/Users/index";
import bcrypt from "bcryptjs";

export const validateUser = (user: Partial<CreateUser>): boolean => {
  return !!user.email && !!user.password && !!user.role;
};

export const isValidRole = (role: string): role is Role => {
  return ["ADMIN", "CLIENT", "SECRETARY", "SUPERVISOR"].includes(role);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const isSubscriptionActive = (subscriptionEndDate?: Date): boolean => {
  if (!subscriptionEndDate) return false;
  return new Date(subscriptionEndDate) > new Date();
};
