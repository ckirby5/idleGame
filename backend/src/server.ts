import express = require("express");
import type { Request, Response, Application } from "express";

const app: Application = express();
const port: number = 3000;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.listen(port, (): void => {
  console.log(`Example app listening on port ${port}`);
});