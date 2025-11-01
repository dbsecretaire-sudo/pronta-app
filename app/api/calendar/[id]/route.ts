// app/api/calendar/[id]/route.ts
import { NextResponse } from 'next/server';
import { CalendarEventService } from "../service";

const eventService = new CalendarEventService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await eventService.getEventById(Number(params.id));

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
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await request.json();
    const updatedEvent = await eventService.updateEvent(Number(params.id), event);
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await eventService.deleteEvent(Number(params.id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
