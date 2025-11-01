export interface CalendarEvent {
  id: number;
  user_id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  description?: string;
}

export type CreateCalendarEvent = Omit<CalendarEvent, "id">

export interface CalendarEventFilter {
  userId?: number;
  startDate?: Date;
  endDate?: Date;
}