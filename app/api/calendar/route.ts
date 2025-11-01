// app/api/calendar/route.ts
import { NextResponse } from 'next/server';
import { CalendarEventService } from "./service";
import { validateCalendarEvent } from "./utils";

const eventService = new CalendarEventService();

// GET /api/calendar
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const events = await eventService.getEventsByUserId(Number(userId));
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/calendar
export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (!validateCalendarEvent(event)) {
      return NextResponse.json(
        { error: "Invalid event data" },
        { status: 400 }
      );
    }

    const newEvent = await eventService.createEvent(event);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
