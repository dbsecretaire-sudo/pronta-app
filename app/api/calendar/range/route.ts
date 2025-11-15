// app/api/calendar/range/route.ts
import { NextResponse } from 'next/server';
import { CalendarEventService } from "../service";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
const API_URL = process.env.NEXTAUTH_URL
const eventService = new CalendarEventService();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
     return NextResponse.redirect(new URL(`${API_URL}/unauthorized`, request.url));  
  }
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "userId, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const events = await eventService.getEventsInRange({
      userId: Number(userId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
