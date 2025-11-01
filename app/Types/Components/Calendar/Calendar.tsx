"use client";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "@/app/Types/Calendar/index";

const localizer = momentLocalizer(moment);

function Calendar({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start_time"
        endAccessor="end_time"
        titleAccessor="title"
      />
    </div>
  );
}


export default Calendar;