import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { withAuth } from '@/src/utils/withAuth';
const API_URL = process.env.NEXTAUTH_URL
const userService = new UserService;

export async function PUT(
  request: NextRequest,
{ params }: { params: Promise<{ id: string; serviceId: string }> }
) {

  return withAuth(request, async (session) => {

    try {
        const { id, serviceId } = await params; 
        await userService.reactivateUserService(Number(id), Number(serviceId));
        const safeResponse = {success: true};
        return NextResponse.json(safeResponse);
    } catch (error) {
        return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to deactivate service" },
        { status: 500 }
        );
    }
  });
}
