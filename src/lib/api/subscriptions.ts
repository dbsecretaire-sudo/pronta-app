import { Subscription, SubscriptionWithService } from "@/src/Types/Subscription";

export const updateUserSubscription = async (
  subscription_id: number,
  data: {
    user_id: number;
    service_id: number;
    start_date?: string | Date;
    end_date?: string | Date;
    next_payment_date?: string | Date | null;
    status?: string;
  }
): Promise<Subscription> => {
  const requestData = {
    ...data,
    ...(data.start_date && { start_date: data.start_date instanceof Date ? data.start_date.toISOString() : data.start_date }),
    ...(data.end_date && { end_date: data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date }),
    ...(data.next_payment_date && { next_payment_date: data.next_payment_date instanceof Date ? data.next_payment_date.toISOString() : data.next_payment_date }),
  };
  const res = await fetch(`/api/subscription/${subscription_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`HTTP error: ${res.status} - ${JSON.stringify(errorData)}`);
  }
  return res.json();
};

export async function deleteSubscription(subscriptionId: number): Promise<void> {
  const response = await fetch(`/api/subscription/${subscriptionId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error("Failed to delete subscription");
}

export async function getSubscriptionByService(userId: number, service_id: number): Promise<Subscription[] | null> {
  const response = await fetch(`/api/subscription/user/${userId}?service_id=${encodeURIComponent(service_id)}`);
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  return response.json();
}

export async function createSubscription(subscriptionData: {
  user_id: number;
  service_id: number;
  start_date: Date;
  end_date: Date;
  next_payment_date: Date;
  status: string;
}): Promise<void> {
  const response = await fetch(`/api/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...subscriptionData,
      start_date: subscriptionData.start_date.toISOString(),
      end_date: subscriptionData.end_date.toISOString(),
      next_payment_date: subscriptionData.next_payment_date.toISOString(),
    }),
  });
  if (!response.ok) throw new Error("Failed to create subscription");
}

export async function fetchUserSubscriptions(userId: number) {
  const res = await fetch(`/api/subscription/user/${userId}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
