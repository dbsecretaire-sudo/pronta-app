import { Router } from "express";
import {
  getUserServices,
  getUserService,
  assignServiceToUser,
  updateUserService,
  revokeUserService,
} from "./controller";

const router = Router({ mergeParams: true });

router.get("/", getUserServices);
router.get("/:Id", getUserService);
router.post("/", assignServiceToUser);
router.put("/:Id", updateUserService);
router.delete("/:Id", revokeUserService);

export default router;
