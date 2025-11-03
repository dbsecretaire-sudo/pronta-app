import { Subscription } from "@/src/Types/Subscription";
import { SubscriptionModel } from "@/src/Types/Subscription/model";

export class SubscriptionService {
  private subscriptionModel = new SubscriptionModel({} as Subscription);

  async updateUserSubscription(subscription_id: number, updatedData: any): Promise<Subscription> {
    return this.subscriptionModel.updateSubscription(subscription_id, updatedData);
  }

   async createUserSubscription(subscription_id: number, updatedData: any): Promise<Subscription> {
    return this.subscriptionModel.createUserSubscription(subscription_id, updatedData);
  }

   async deleteUserSubscription(subscription_id: number): Promise<void> {
    this.subscriptionModel.deleteUserSubscription(subscription_id);
  }

  async getSubscriptionByUserId(user_id: number): Promise<Subscription[]> {
    return this.subscriptionModel.getSubscriptionByUserId(user_id);
  }

  async getSubscriptionByUserIdAndPlan(user_id: number, plan: string): Promise<Subscription[]> {
    return this.subscriptionModel.getSubscriptionByUserIdAndPlan(user_id, plan);
  }
}

