import { NextResponse } from "next/server";
import { CallService } from "../service";

const callService = new CallService();


export async function GET(request: Request) {
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
