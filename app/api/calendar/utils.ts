import { CalendarEvent, CreateCalendarEvent } from "@/Types/Calendar/index";

export const validateCalendarEvent = (event: Partial<CreateCalendarEvent>): boolean => {
  return !!event.title && !!event.user_id && !!event.start_time && !!event.end_time;
};

export const isEventInRange = (event: CalendarEvent, startDate: Date, endDate: Date): boolean => {
  return event.start_time >= startDate && event.end_time <= endDate;
};