import { NextResponse } from 'next/server';
import { updateResource } from '@/src/lib/admin/api';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const data = await request.json();

  try {
    const result = await updateResource(resource, undefined, data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}