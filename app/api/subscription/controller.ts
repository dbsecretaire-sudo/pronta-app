import { SubscriptionService } from './service'; // Adaptez le chemin

const subscriptionService = new SubscriptionService();

export const updateUserSubscription = async (subscription_id: number, userData: any) => {
  return await subscriptionService.updateUserSubscription(subscription_id, userData);
}

export async function createUserSubscription(userId: number, subscriptionData: any) {
  return await subscriptionService.createUserSubscription(userId, subscriptionData)
}

export async function deleteUserSubscription(subscriptionId: number) {
  return await subscriptionService.deleteUserSubscription(subscriptionId);
}

export async function getSubscriptionByUserId(userId: number) {
  return await subscriptionService.getSubscriptionByUserId(userId);
}