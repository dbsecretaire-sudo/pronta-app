import { NextResponse } from 'next/server';
import { UserModel } from '../../types';
import { updateUserSubscription } from '../../controller';

//PUT /api/user/[id]/subscription
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userData = await request.json();
    console.log("user/[id]/subscription");
    const updatedUser = await updateUserSubscription(Number(id), userData);
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}