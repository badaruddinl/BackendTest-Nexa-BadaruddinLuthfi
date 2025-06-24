import { Response as ExpressResponse } from "express";

interface InterceptorResponse {
  success: boolean;
  code: string;
  message: string | object;
  data?: any;
  errors?: any;
}

function Interceptor(
  res: ExpressResponse,
  statusCode: number,
  success: boolean,
  code: string,
  message: string | object,
  data?: any,
  errors?: any
) {
  const baseResponse: InterceptorResponse = {
    success,
    code,
    message,
  };

  // Avoid sending empty objects as data
  const isEmptyObject =
    data && typeof data === "object" && Object.keys(data).length === 0;

  if (data !== undefined && data !== null && !isEmptyObject) {
    baseResponse.data = data;
  }

  if (errors) {
    baseResponse.errors = errors;
  }

  return res.status(statusCode).json(baseResponse);
}

export default Interceptor;
