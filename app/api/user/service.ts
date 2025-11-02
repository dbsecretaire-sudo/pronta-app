import { User, CreateUser, UpdateUser, UserFilter, UserModel } from "./types";
import { validateUser, hashPassword, isValidRole, isSubscriptionActive } from "./utils";

export class UserService {
  private userModel = new UserModel({} as User);

  async getAllUsers(filters?: UserFilter): Promise<User[]> {
    return this.userModel.getAllUsers(filters);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userModel.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.getUserByEmail(email);
  }

  async createUser(user: CreateUser): Promise<User> {
    if (!validateUser(user)) {
      throw new Error("Email, password, and role are required");
    }
    if (!isValidRole(user.role)) {
      throw new Error("Invalid role");
    }

    const password_hash = await hashPassword(user.password);

    // Convertir les Date en timestamps pour la base de données
    const userData = {
      ...user,
      password_hash,
      subscription_end_date: user.subscription_end_date,
      next_payment_date: user.next_payment_date
    };

    return this.userModel.createUser(userData);
  }

  async updateUser(id: number, user: UpdateUser): Promise<User> {

    return this.userModel.updateUser(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    // Note: La suppression en cascade est gérée par la base (ON DELETE CASCADE)
    return this.userModel.deleteUser(id);
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userModel.getUserByEmail(email);
    return !!user;
  }

  async getUsersBySubscriptionPlan(plan: string): Promise<User[]> {
    return this.userModel.getUsersBySubscriptionPlan(plan);
  }

  async getUsersWithActiveSubscription(): Promise<User[]> {
    return this.userModel.getUsersWithActiveSubscription();
  }
}
