// src/app/api/admin/calls/[id]/route.ts
import { NextResponse } from 'next/server';
import { getResourceById, updateResource } from '@/src/lib/admin/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const call = await getResourceById('calls', parseInt(params.id));
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
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedCall = await updateResource('calls', parseInt(params.id), data);
    return NextResponse.json(updatedCall);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    );
  }
}
