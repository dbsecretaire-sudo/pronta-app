// app/api/calls/route.ts
import { NextResponse } from 'next/server';
import { CallService } from './service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const callService = new CallService();

// GET /api/calls?userId=XXX&byName=XXX&byPhone=XXX
export async function GET(request: Request) {

  const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const byName = searchParams.get('byName');
    const byPhone = searchParams.get('byPhone');

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "Invalid userId" },
        { status: 400 }
      );
    }

    const calls = await callService.getCallsByUserId({
      userId: Number(userId),
      byName: byName || undefined,
      byPhone: byPhone || undefined,
    });

    return NextResponse.json(calls);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    );
  }
}

// POST /api/calls
export async function POST(request: Request) {
  try {
    const call = await request.json();
    const newCall = await callService.createCall(call);
    return NextResponse.json(newCall, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    );
  }
}
