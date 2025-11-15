import { NextResponse } from 'next/server';
import { UserService } from '../../../service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const userService = new UserService;

export async function PUT(
  request: Request,
{ params }: { params: Promise<{ id: string; serviceId: string }> }
) {

      const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));  
    }

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
}
