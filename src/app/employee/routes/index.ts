import { Router } from "express";
import { registerRoute } from "utils/registerRoute.utils";
import { apiValidation, apiValidationAdmin } from "services/validations";
import { createEmployeeController } from "../controllers";

const employeeRoutes = Router();

registerRoute(employeeRoutes, {
  method: "post",
  url: "/create",
  preHandler: [apiValidation, apiValidationAdmin],
  handler: createEmployeeController,
});

export default employeeRoutes;
