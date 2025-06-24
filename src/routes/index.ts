import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript!" });
});

router.post("/echo", (req: Request, res: Response) => {
  res.json({ youSent: req.body });
});

export default router;
