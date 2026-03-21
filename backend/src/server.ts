import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import authRouter from "./routes/auth";
import { authenticate, AuthenticatedRequest } from "./middleware/auth";
import miningRouter from "./routes/mining";
import characterRouter from "./routes/character";
import cors from "cors";


const app = express();
const port: number = 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:51223",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/auth", authRouter);
app.use("/api/mining", miningRouter);
app.use("/api/character", characterRouter);

app.get("/", async (req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany();
  res.json({ message: "Hello World!", users });
});

app.get("/api/test-auth", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).userId;
  res.json({ message: "You are authenticated!", userId });
});

app.get("/api/test-ores", async (req, res) => {
  const ores = await prisma.resourceDefinition.findMany();
  res.json(ores);
});

app.listen(port, (): void => {
  console.log(`Example app listening on port ${port}`);
});

export { prisma };