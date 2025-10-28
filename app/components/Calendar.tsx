"use client";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "../lib/types";

const localizer = momentLocalizer(moment);

export default function Calendar({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
      />
    </div>
  );
}
