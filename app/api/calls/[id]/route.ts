import { NextResponse } from 'next/server';
import { CallService } from '../service';

const callService = new CallService();

// GET /api/calls/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const call = await callService.getCallById(Number(params.id));
    if (!call) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(call);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch call" },
      { status: 500 }
    );
  }
}

// PUT /api/calls/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const call = await request.json();
    const updatedCall = await callService.updateCall(Number(params.id), call);
    return NextResponse.json(updatedCall);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update call" },
      { status: 500 }
    );
  }
}

// DELETE /api/calls/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await callService.deleteCall(Number(params.id));
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete call" },
      { status: 500 }
    );
  }
}
