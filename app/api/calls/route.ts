import { Router } from "express";
import {
  getCallsByUserId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
} from "./controller";

const router = Router();

router.get("/", getCallsByUserId);
router.get("/:id", getCallById);
router.post("/", createCall);
router.put("/:id", updateCall);
router.delete("/:id", deleteCall);

export default router;
