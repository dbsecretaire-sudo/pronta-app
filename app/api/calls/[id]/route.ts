// app/api/calls/[id]/route.ts
import { NextResponse } from 'next/server';
import { CallService } from '../service';

const callService = new CallService();

// GET /api/calls/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const call = await callService.getCallById(Number(id));

    if (!call) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(call);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch call' },
      { status: 500 }
    );
  }
}

// PUT /api/calls/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const call = await request.json();
    const updatedCall = await callService.updateCall(Number(id), call);
    return NextResponse.json(updatedCall);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    );
  }
}

// DELETE /api/calls/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await callService.deleteCall(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete call' },
      { status: 500 }
    );
  }
}
