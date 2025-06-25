import { Router } from "express";
import { registerRoute } from "utils/registerRoute.utils";
import { loginController, registerController } from "../controllers";
import {
  accessValidation,
  apiValidation,
  bearerValidation,
} from "services/validations";
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
  handler: registerController,
});

export default authRoutes;
