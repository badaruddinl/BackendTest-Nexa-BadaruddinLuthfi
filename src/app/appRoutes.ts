import { Router, Request, Response } from "express";
import authRoutes from "./auth/routes";
import employeeRoutes from "./employee/routes";
const appRoutes = Router();

appRoutes.use("/auth", authRoutes);
appRoutes.use("/employee", employeeRoutes);

export default appRoutes;
