// src/app/api/admin/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import { getResourceById, updateResource } from '@/src/lib/admin/api';

export async function GET(
  request: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await getResourceById('clients', Number(id));
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const updatedClient = await updateResource('clients', Number(id), data);
    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
