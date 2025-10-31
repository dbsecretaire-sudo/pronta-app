import { Router } from "express";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "../controller";

const router = Router({ mergeParams: true });

// GET /api/user/:id - Récupère un utilisateur spécifique
router.get("/", getUserById);

// PUT /api/user/:id - Met à jour un utilisateur
router.put("/", updateUser);

// DELETE /api/user/:id - Supprime un utilisateur
router.delete("/", deleteUser);

export default router;
