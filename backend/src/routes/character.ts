import { Router, RequestHandler } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { getCharacterStats } from "../controllers/characterController";

const router = Router();

router.use(authenticate);

router.get("/stats", getCharacterStats as unknown as RequestHandler);


export default router;