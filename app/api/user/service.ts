import { User, CreateUser, UpdateUser, UserFilter, UserModel, Role } from "./types";
import { validateUser, hashPassword, isValidRole } from "./utils";

export class UserService {
  private userModel = new UserModel({} as User);

  // async getAllUsers(filters?: UserFilter): Promise<User[]> {
  //   return this.userModel.getAllUsers(filters);
  // }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.getAllUsers();
  }

  async getAllUsersName(): Promise<Record<number, { id: number; name: string; }>> {
    return this.userModel.getAllUsersName();
  }
  
  async getAllUsersRole(): Promise<Record<number, { id: number; role: string; }>> {
    return this.userModel.getAllUsersRole();
  }

  async getRoleByUserId(id: number): Promise<{role: Role}> {
    return this.userModel.getRoleByUserId(id);
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

    // Préparation des données pour la création de l'utilisateur
    const userData = {
      ...user,
      password_hash
    };

    // Suppression du mot de passe en clair avant l'envoi au modèle
    const { password, ...cleanUserData } = userData;

    return this.userModel.createUser(cleanUserData);
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
