import { Router, RequestHandler } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { getAvailableResources, startMining, getMiningStatus, claimMiningResources } from "../controllers/miningController";

const router = Router();

router.use(authenticate);

router.get("/resources", getAvailableResources as unknown as RequestHandler);

router.post("/start", startMining as unknown as RequestHandler);


router.get("/status", getMiningStatus as unknown as RequestHandler);

router.post("/claim", claimMiningResources as unknown as RequestHandler);


export default router;