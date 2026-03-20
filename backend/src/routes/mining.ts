import { Router, RequestHandler } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { getAvailableResources, startMining, getMiningStatus, stopMining } from "../controllers/miningController";

const router = Router();

router.use(authenticate);

router.get("/resources", getAvailableResources as unknown as RequestHandler);

router.post("/start", startMining as unknown as RequestHandler);


router.get("/status", getMiningStatus as unknown as RequestHandler);

router.post("/stop", stopMining as unknown as RequestHandler);


export default router;