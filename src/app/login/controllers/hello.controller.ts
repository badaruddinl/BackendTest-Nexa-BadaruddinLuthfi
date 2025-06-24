import { Request, Response } from "express";
import Interceptor from "utils/responseInterceptor.utils";

export const helloHandler = (req: Request, res: Response) => {
  Interceptor(res, 200, true, "00", "Hello from helloHandler");
};
