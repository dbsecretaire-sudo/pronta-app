import { Router } from "express";
import {
  getServiceById,
  updateService,
  deleteService,
} from "../controller";

const router = Router({ mergeParams: true });

// GET /api/services/:id - Récupère un service spécifique
router.get("/", getServiceById);

// PUT /api/services/:id - Met à jour un service
router.put("/", updateService);

// DELETE /api/services/:id - Supprime un service
router.delete("/", deleteService);

export default router;
