import { Router } from "express";
import {
  getClientsByUserId,
  searchClients,
  createClient,
} from "./controller";
import idRouter from "./[id]/route"; // Routes dynamiques (GET/:id, PUT/:id, DELETE/:id)

const router = Router();

// Routes statiques
router.get("/", getClientsByUserId);          // GET /api/clients
router.get("/search", searchClients);        // GET /api/clients/search
router.post("/", createClient);              // POST /api/clients

// Routes dynamiques (déplacées dans [id]/route.ts)
router.use("/:id", idRouter); // Capture GET/:id, PUT/:id, DELETE/:id

export default router;
