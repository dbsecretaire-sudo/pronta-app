import { Router } from "express";
import {
  getUserServices,
  updateUserService,
  revokeUserService,
} from "../controller";

const router = Router({ mergeParams: true });

// GET /api/userServices/:userId - Liste les services d'un utilisateur
router.get("/", getUserServices);

// PATCH /api/userServices/:userId/:serviceId - Met à jour les permissions d'un service utilisateur
router.patch("/:serviceId", updateUserService);

// DELETE /api/userServices/:userId/:serviceId - Révoque un service pour un utilisateur
router.delete("/:serviceId", revokeUserService);

export default router;
