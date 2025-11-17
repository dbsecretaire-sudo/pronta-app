import { NextRequest, NextResponse } from "next/server";
import { CallService } from "../service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { withAuth } from "@/src/utils/withAuth";
const API_URL = process.env.NEXTAUTH_URL
const callService = new CallService();


export async function GET(request: NextRequest) {

  return withAuth(request, async (session) => {

    try {
      const calls = await callService.getAllCalls();
            return NextResponse.json(calls);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch calls' },
        { status: 500 }
      );
    }
  });
}
