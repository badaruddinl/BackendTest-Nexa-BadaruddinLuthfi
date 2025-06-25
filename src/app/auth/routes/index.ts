import { Router, Request, Response } from "express";
import { registerRoute } from "utils/registerRoute.utils";
import { loginController, registerController } from "../controllers";
const authRoutes = Router();

registerRoute(authRoutes, {
  method: "post",
  url: "/login",
  handler: loginController,
});

registerRoute(authRoutes, {
  method: "post",
  url: "/register",
  handler: registerController,
});

export default authRoutes;
