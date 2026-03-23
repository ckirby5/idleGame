import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getActiveTask } from "../controllers/taskController";

const router = Router();

router.get("/active", authenticate, getActiveTask);

export default router;