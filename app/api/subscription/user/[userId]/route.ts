import { getSubscriptionByUserId } from '@/app/api/subscription/controller';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
console.log("GET SUBSCRIPTIONS OK");
    const users = await getSubscriptionByUserId(Number(userId));
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

