import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "up", service: "crud" });
});

export default healthRouter;