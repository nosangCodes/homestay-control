import { json } from "body-parser";
import express, { type Express } from "express";
import cors from "cors";
import userRoutes from "./routes/user";

export const createServer = (): Express => {
  const app = express();

  app
    .use(json())
    .use(cors())
    .use("/user", userRoutes)
    .get("/status", (_, res) => {
      res.json({ ok: true });
    });

  return app;
};
