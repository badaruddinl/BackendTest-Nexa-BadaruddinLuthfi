import { Router, Request, Response } from "express";
import loginRoutes from "./login/routes";
const appRoutes = Router();

appRoutes.use("/", loginRoutes);

export default appRoutes;
