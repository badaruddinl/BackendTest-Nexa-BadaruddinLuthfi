import { Router } from "express";
import { registerRoute } from "utils/registerRoute.utils";
import { loginController, registerController } from "../controllers";
import { apiValidation } from "services/validations";
const authRoutes = Router();

registerRoute(authRoutes, {
  method: "post",
  url: "/login",
  // preHandler: [apiValidation, bearerValidation, accessValidation],
  handler: loginController,
});

registerRoute(authRoutes, {
  method: "post",
  url: "/register",
  preHandler: [apiValidation],
  handler: registerController,
});

export default authRoutes;
