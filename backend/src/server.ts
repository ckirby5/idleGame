import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import authRouter from "./routes/auth";

const app = express();
const port: number = 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.use("/api/auth", authRouter);


app.get("/", async (req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany();
  res.json({ message: "Hello World!", users });
});

app.listen(port, (): void => {
  console.log(`Example app listening on port ${port}`);
});

export { prisma };