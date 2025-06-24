import { Router, Request, Response } from "express";
import { registerRoute } from "utils/registerRoute.utils";
import { helloHandler } from "../controllers";
const loginRoutes = Router();

registerRoute(loginRoutes, {
  method: "get",
  url: "/",
  handler: helloHandler,
});

export default loginRoutes;
