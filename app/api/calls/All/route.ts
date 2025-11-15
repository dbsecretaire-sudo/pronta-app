import { NextResponse } from "next/server";
import { CallService } from "../service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const callService = new CallService();


export async function GET(request: Request) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));  
  }

  try {
    const calls = await callService.getAllCalls();
          return NextResponse.json(calls);
  } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch calls' },
        { status: 500 }
      );
    }
}
