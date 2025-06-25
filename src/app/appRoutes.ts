import { Router, Request, Response } from "express";
import authRoutes from "./auth/routes";
const appRoutes = Router();

appRoutes.use("/auth", authRoutes);

export default appRoutes;
