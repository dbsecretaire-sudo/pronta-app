// app/api/user/subscription/[plan]/route.ts
import { NextResponse } from 'next/server';
import { getUsersBySubscriptionPlan, updateUserSubscription } from '../../controller';

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string, plan: string }> }
) {
  try {
    const { id, plan } = await params;
    const userData = await request.json();
    const updatedUser = await updateUserSubscription(Number(id), plan,  userData);
;
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

