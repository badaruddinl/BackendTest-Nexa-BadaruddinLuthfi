import { AuthService } from "app/auth/services/auth.service";
import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getInfo } from "utils/getInfo.utils";
import Interceptor from "utils/responseInterceptor.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "services/jwt";

interface CustomJwtPayload extends JwtPayload {
  id: number;
  username: string;
}

// const accessValidation = async (
//   request: Request,
//   reply: Response
// ): Promise<any> => {
//     try {
//       const authService = new AuthService();
//     const info = await getInfoCheck(request);

//     if (!info) {
//       Interceptor(reply, StatusCodes.UNAUTHORIZED, false, "01", "Unautorized");
//       return;
//     }

//     const authorized = await authService.checkID(info.id);

//     if (authorized.statusCodes === StatusCodes.NOT_FOUND) {
//       Interceptor(
//         reply,
//         StatusCodes.UNAUTHORIZED,
//         false,
//         "01",
//         "Unauthorized, do not have permission to access.",
//         ""
//       );
//     }
//   } catch (error) {
//     Interceptor(
//       reply,
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       false,
//       "500",
//       "Error occurred"
//     );
//   }
// };

const apiValidation = async (
  request: Request,
  reply: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authService = new AuthService();
    const info = await getInfo(request);

    if (!info) {
      Interceptor(reply, StatusCodes.UNAUTHORIZED, false, "01", "Unautorized");
      return;
    }

    const authorized = await authService.checkID(info.id);
    console.log(authorized);

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      Interceptor(
        reply,
        StatusCodes.UNAUTHORIZED,
        false,
        "401",
        "Bearer token is missing"
      );
      return;
    }

    const auth = authorizationHeader.split(" ")[1];

    if (!auth) {
      Interceptor(
        reply,
        StatusCodes.UNAUTHORIZED,
        false,
        "401",
        "Bearer token is missing"
      );
      return;
    }

    const decoded = jwt.decode(auth) as CustomJwtPayload | null;

    if (!decoded) {
      Interceptor(
        reply,
        StatusCodes.UNAUTHORIZED,
        false,
        "401",
        "Invalid token payload."
      );
      return;
    }

    const { id, username, exp } = decoded;

    if (!id || !username) {
      Interceptor(
        reply,
        StatusCodes.UNAUTHORIZED,
        false,
        "401",
        "Unauthorized, missing required claims."
      );
      return;
    }

    if (exp && exp < Date.now() / 1000) {
      Interceptor(
        reply,
        StatusCodes.UNAUTHORIZED,
        false,
        "401",
        "Token session expired."
      );
      return;
    }

    (request as any).user = { id, username };
    next();
  } catch (error) {
    Interceptor(
      reply,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "500",
      "Error occurred"
    );
  }
};

const apiValidationAdmin = async (
  request: Request,
  reply: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authService = new AuthService();
    const info = await getInfo(request);

    if (!info) {
      Interceptor(reply, StatusCodes.UNAUTHORIZED, false, "01", "Unautorized");
      return;
    }

    const authorized = await authService.checkID(info.id);

    if (authorized.statusCodes !== StatusCodes.OK) {
      Interceptor(
        reply,
        StatusCodes.FORBIDDEN,
        false,
        "01",
        "Dont have access"
      );
    }

    next();
  } catch (error) {
    Interceptor(
      reply,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "500",
      "Error occurred"
    );
  }
};

export { apiValidation, apiValidationAdmin };
