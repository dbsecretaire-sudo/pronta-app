import { Request, Response } from "express";
import { CalendarEventService } from "./service";
import { validateCalendarEvent } from "./utils";

const eventService = new CalendarEventService();

export const getEventsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const events = await eventService.getEventsByUserId(Number(userId));
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(Number(id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const getEventsInRange = async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;
    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ error: "userId, startDate, and endDate are required" });
    }
    const events = await eventService.getEventsInRange({
      userId: Number(userId),
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = req.body;
    if (!validateCalendarEvent(event)) {
      return res.status(400).json({ error: "Invalid event data" });
    }
    const newEvent = await eventService.createEvent(event);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = req.body;
    const updatedEvent = await eventService.updateEvent(Number(id), event);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eventService.deleteEvent(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};
