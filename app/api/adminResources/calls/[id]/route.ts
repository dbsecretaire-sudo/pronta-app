// src/app/api/admin/calls/[id]/route.ts
import { NextResponse } from 'next/server';
import { getResourceById, updateResource } from '@/src/lib/admin/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const call = await getResourceById('calls', Number(id));
    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }
    return NextResponse.json(call);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch call' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await params;
    const data = await request.json();
    const updatedCall = await updateResource('calls', Number(id), data);
    return NextResponse.json(updatedCall);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    );
  }
}
