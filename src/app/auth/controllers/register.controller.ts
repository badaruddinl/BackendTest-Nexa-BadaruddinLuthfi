import { Request, Response } from "express";
import Interceptor from "utils/responseInterceptor.utils";
import { AuthService } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { AppHandler } from "types/express.s";
import { RegisterInterface } from "../interfaces";

export const registerController: AppHandler<
  {},
  any,
  RegisterInterface
> = async (req: Request, res: Response) => {
  const authService = new AuthService();

  try {
    const body = req.body;

    const result = await authService.register(body);

    Interceptor(
      res,
      result.statusCodes,
      result.success,
      result.code,
      result.message
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
