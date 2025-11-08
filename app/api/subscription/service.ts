import {
  Subscription,
  SubscriptionWithService,
  CreateSubscription,
  UpdateSubscription
} from "@/src/lib/schemas/subscription";
import { SubscriptionModel } from "./types";

export class SubscriptionService {
  private subscriptionModel: SubscriptionModel;

  constructor() {
    this.subscriptionModel = new SubscriptionModel();
  }

  /**
   * Met à jour un abonnement existant
   * @param subscriptionId ID de l'abonnement à mettre à jour
   * @param updatedData Données de mise à jour (validées par UpdateSubscriptionSchema)
   * @returns L'abonnement mis à jour
   */
  async updateUserSubscription(
    subscriptionId: number,
    updatedData: UpdateSubscription
  ): Promise<Subscription> {
    return this.subscriptionModel.updateSubscription(subscriptionId, updatedData);
  }

  /**
   * Crée un nouvel abonnement pour un utilisateur
   * @param userId ID de l'utilisateur
   * @param subscriptionData Données de l'abonnement (validées par CreateSubscriptionSchema)
   * @returns L'abonnement créé
   */
  async createUserSubscription(
    userId: number,
    subscriptionData: CreateSubscription
  ): Promise<Subscription> {
    return this.subscriptionModel.createUserSubscription(userId, subscriptionData);
  }

  /**
   * Récupère tous les abonnements
   * @returns Liste de tous les abonnements
   */
  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionModel.getAllSubscriptions();
  }

  /**
   * Supprime un abonnement
   * @param subscriptionId ID de l'abonnement à supprimer
   */
  async deleteUserSubscription(subscriptionId: number): Promise<void> {
    await this.subscriptionModel.deleteUserSubscription(subscriptionId);
  }

  /**
   * Récupère les abonnements d'un utilisateur avec les détails des services
   * @param userId ID de l'utilisateur
   * @returns Liste des abonnements avec leurs services associés
   */
  async getSubscriptionByUserId(userId: number): Promise<SubscriptionWithService[]> {
    return this.subscriptionModel.getSubscriptionByUserId(userId);
  }

  /**
   * Récupère un abonnement spécifique pour un utilisateur et un service
   * @param userId ID de l'utilisateur
   * @param serviceId ID du service
   * @returns L'abonnement trouvé ou null si non trouvé
   */
  async getSubscriptionByUserIdAndService(
    userId: number,
    serviceId: number
  ): Promise<Subscription | null> {
    return this.subscriptionModel.getSubscriptionByUserIdAndService(userId, serviceId);
  }

  /**
   * Crée ou met à jour un abonnement (upsert)
   * @param userId ID de l'utilisateur
   * @param subscriptionData Données de l'abonnement
   * @returns L'abonnement créé ou mis à jour
   */
  async upsertUserSubscription(
    userId: number,
    subscriptionData: CreateSubscription
  ): Promise<Subscription> {
    // Vérifie si l'abonnement existe déjà
    const existingSubscription = await this.getSubscriptionByUserIdAndService(
      userId,
      subscriptionData.service_id
    );

    if (existingSubscription) {
      return this.updateUserSubscription(existingSubscription.id, subscriptionData);
    }

    return this.createUserSubscription(userId, subscriptionData);
  }

  /**
   * Récupère un utilisateur avec ses abonnements
   * @param userId ID de l'utilisateur
   * @returns L'utilisateur avec ses abonnements
   */
  async getUserWithSubscriptions(userId: number): Promise<any> { // Remplace 'any' par le type User complet si disponible
    return this.subscriptionModel.getUserWithSubscriptions(userId);
  }

  /**
   * Récupère un abonnement par son ID
   * @param subscriptionId ID de l'abonnement
   * @returns L'abonnement trouvé
   * @throws Error Si l'abonnement n'est pas trouvé
   */
  async getSubscriptionById(subscriptionId: number): Promise<Subscription> {
    return this.subscriptionModel.getSubscriptionById(subscriptionId);
  }
}
