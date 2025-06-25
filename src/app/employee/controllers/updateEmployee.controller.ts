import { Request, Response } from "express";
import Interceptor from "utils/responseInterceptor.utils";
import { StatusCodes } from "http-status-codes";
import { AppHandler } from "types/express.s";
import { EmployeeService } from "../services/employee.service";
import { UpdateEmployeeInterface } from "../interfaces";
import { getInfo } from "utils/getInfo.utils";

const updateEmployeeController: AppHandler<
  {},
  any,
  UpdateEmployeeInterface
> = async (req: Request, res: Response) => {
  const employeeService = new EmployeeService();

  try {
    const userLogin = await getInfo(req);
    const reqParams = req.params.nip;
    const reqBody = req.body;

    const request = {
      nama: reqBody.nama,
      alamat: reqBody.alamat,
      gend: reqBody.gend,
      tgl_lahir: reqBody.tgl_lahir,
      photo: reqBody.photo,
    } as UpdateEmployeeInterface;

    const result = await employeeService.updateEmployee(
      reqParams,
      request,
      userLogin.username
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

export default updateEmployeeController;
