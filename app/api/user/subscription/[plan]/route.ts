// app/api/user/subscription/[plan]/route.ts
import { NextResponse } from 'next/server';
import { getUsersBySubscriptionPlan } from '../../controller';

// GET /api/user/subscription/[plan]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ plan: string }> }
) {
  try {
    const { plan } = await params;
    const users = await getUsersBySubscriptionPlan(plan);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users by subscription plan" },
      { status: 500 }
    );
  }
}
