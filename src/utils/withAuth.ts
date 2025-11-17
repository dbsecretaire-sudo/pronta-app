// utils/withAuth.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { jwtVerify } from 'jose';
export async function withAuth(
  req: NextRequest, // <-- Utilise NextRequest au lieu de Request
  handler: (payload: any) => Promise<NextResponse | Response>
) {
    try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

    try {
      const { payload } = await jwtVerify(token, secret);
      return handler(payload);
    } catch (error) {
        return NextResponse.json(
          { error: "Token invalide ou expiré" },
          { status: 401 }
        );
    }
  } catch (error) {
    console.error("Erreur dans withAuth:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
