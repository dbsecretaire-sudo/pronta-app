import { Router } from "express";
import {
  getEventsByUserId,
  getEventById,
  getEventsInRange,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./controller";

const router = Router();

// Routes pour /api/calendar
router.get("/", getEventsByUserId);
router.get("/range", getEventsInRange);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
