import { CalendarEventModel, CalendarEvent, CreateCalendarEvent, CalendarEventFilter } from "@/Types/Calendar/index";
import { validateCalendarEvent } from "./utils";

export class CalendarEventService {
  private eventModel = new CalendarEventModel({} as CalendarEvent);

  async getEventsByUserId(userId: number): Promise<CalendarEvent[]> {
    return this.eventModel.getEventsByUserId(userId);
  }

  async getEventById(id: number): Promise<CalendarEvent | null> {
    return this.eventModel.getEventById(id);
  }

  async getEventsInRange(filters: CalendarEventFilter): Promise<CalendarEvent[]> {
    if (!filters.userId) throw new Error("User ID is required");
    return this.eventModel.getEventsInRange(filters.userId, filters.startDate!, filters.endDate!);
  }

  async createEvent(event: CreateCalendarEvent): Promise<CalendarEvent> {
    if (!validateCalendarEvent(event)) {
      throw new Error("Invalid event data");
    }
    return this.eventModel.createEvent(event);
  }

  async updateEvent(id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.eventModel.updateEvent(id, event);
  }

  async deleteEvent(id: number): Promise<void> {
    return this.eventModel.deleteEvent(id);
  }
}
