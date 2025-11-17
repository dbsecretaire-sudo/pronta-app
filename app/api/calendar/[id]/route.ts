// app/api/calendar/[id]/route.ts
import { withAuth } from '@/src/utils/withAuth';
import { NextRequest, NextResponse } from 'next/server';
import { CalendarEventService } from "../service";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const eventService = new CalendarEventService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const event = await eventService.getEventById(Number(id));

      if (!event) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(event);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch event" },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,  
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      const event = await request.json();
      const updatedEvent = await eventService.updateEvent(Number(id), event);
      return NextResponse.json(updatedEvent);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  return withAuth(request, async (session) => {

    try {
      const { id } = await params;
      await eventService.deleteEvent(Number(id));
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete event" },
        { status: 500 }
      );
    }
  });
}
