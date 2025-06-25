import { Router } from "express";
import { registerRoute } from "utils/registerRoute.utils";
import { apiValidation, apiValidationAdmin } from "services/validations";
import {
  createEmployeeController,
  getEmployeeController,
  updateEmployeeController,
  updateStatusEmployeeController,
} from "../controllers";

const employeeRoutes = Router();

registerRoute(employeeRoutes, {
  method: "post",
  url: "/create",
  preHandler: [apiValidation, apiValidationAdmin],
  handler: createEmployeeController,
});

registerRoute(employeeRoutes, {
  method: "get",
  url: "/",
  preHandler: [apiValidation, apiValidationAdmin],
  handler: getEmployeeController,
});

registerRoute(employeeRoutes, {
  method: "patch",
  url: "/update/:nip",
  preHandler: [apiValidation, apiValidationAdmin],
  handler: updateEmployeeController,
});

registerRoute(employeeRoutes, {
  method: "patch",
  url: "/update-status/:nip",
  preHandler: [apiValidation, apiValidationAdmin],
  handler: updateStatusEmployeeController,
});

export default employeeRoutes;
