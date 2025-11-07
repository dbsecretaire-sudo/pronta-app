import { Subscription, SubscriptionWithService } from "@/src/Types/Subscription";
import { SubscriptionModel } from "@/src/Types/Subscription/model";

export class SubscriptionService {
  private subscriptionModel: SubscriptionModel;
  
  constructor () {
    this.subscriptionModel = new SubscriptionModel({} as Subscription);
  }

  async updateUserSubscription(subscription_id: number, updatedData: any): Promise<Subscription> {
    return this.subscriptionModel.updateSubscription(subscription_id, updatedData);
  }

   async createUserSubscription(subscription_id: number, updatedData: any): Promise<Subscription> {
    return this.subscriptionModel.createUserSubscription(subscription_id, updatedData);
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionModel.getAllSubscriptions();
  }

   async deleteUserSubscription(subscription_id: number): Promise<void> {
    this.subscriptionModel.deleteUserSubscription(subscription_id);
  }

  async getSubscriptionByUserId(user_id: number): Promise<SubscriptionWithService[]> {
    return this.subscriptionModel.getSubscriptionByUserId(user_id);
  }

  async getSubscriptionByUserIdAndService(user_id: number, service_id: number): Promise<Subscription[]> {
    return this.subscriptionModel.getSubscriptionByUserIdAndService(user_id, service_id);
  }
}

