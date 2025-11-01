// app/api/user/subscription/[plan]/route.ts
import { NextResponse } from 'next/server';
import { getUsersBySubscriptionPlan } from '../../controller';

// GET /api/user/subscription/[plan]
export async function GET(
  request: Request,
  { params }: { params: { plan: string } }
) {
  try {
    const users = await getUsersBySubscriptionPlan(params.plan);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users by subscription plan" },
      { status: 500 }
    );
  }
}
