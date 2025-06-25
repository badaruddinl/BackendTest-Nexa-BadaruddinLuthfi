import { Request, Response } from "express";
import Interceptor from "utils/responseInterceptor.utils";
import { StatusCodes } from "http-status-codes";
import { AppHandler } from "types/express.s";
import { EmployeeService } from "../services/employee.service";
import { CreateEmployeeInterface, QueryOptionInterface } from "../interfaces";
import { getInfo } from "utils/getInfo.utils";

const getEmployeeController: AppHandler<{}, any, QueryOptionInterface> = async (
  req: Request,
  res: Response
) => {
  const employeeService = new EmployeeService();

  try {
    const userLogin = await getInfo(req);
    const reqParams = req.query;

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || "";
    const params = (req.query.params as "name" | null) || null;

    const result = await employeeService.getEmployee({
      page,
      limit,
      offset,
      search,
      params,
    });

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

export default getEmployeeController;
