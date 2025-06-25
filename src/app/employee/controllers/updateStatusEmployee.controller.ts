import { Request, Response } from "express";
import Interceptor from "utils/responseInterceptor.utils";
import { StatusCodes } from "http-status-codes";
import { AppHandler } from "types/express.s";
import { EmployeeService } from "../services/employee.service";
import { CreateEmployeeInterface } from "../interfaces";
import { getInfo } from "utils/getInfo.utils";

const updateStatusEmployeeController: AppHandler<
  {},
  any,
  { nip: string }
> = async (req: Request, res: Response) => {
  const employeeService = new EmployeeService();

  try {
    const userLogin = await getInfo(req);
    const reqBody = req.params;

    const request = { nip: reqBody.nip, update_by: userLogin.username } as {
      nip: string;
      update_by: string;
    };

    const result = await employeeService.updateStatusEmployee(
      request.nip,
      request.update_by
    );

    Interceptor(
      res,
      result.statusCodes,
      result.success,
      result.code,
      result.message,
      result.data
    );
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    let errorDetails = null;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    }
    Interceptor(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "99",
      errorMessage,
      null,
      errorDetails
    );
  }
};

export default updateStatusEmployeeController;
