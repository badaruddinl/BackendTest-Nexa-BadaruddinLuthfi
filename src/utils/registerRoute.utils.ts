import { Router, RequestHandler } from "express";

interface ExpressRouteOptions<
  ReqBody = any,
  ReqParams = Record<string, string>,
  ReqQuery = Record<string, string>,
  ResBody = any
> {
  method: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  preHandler?:
    | RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>
    | RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>[];
  handler: RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>;
}

export const registerRoute = <
  ReqBody = any,
  ReqParams = Record<string, string>,
  ReqQuery = Record<string, string>,
  ResBody = any
>(
  router: Router,
  {
    method,
    url,
    preHandler,
    handler,
  }: ExpressRouteOptions<ReqBody, ReqParams, ReqQuery, ResBody>
) => {
  const handlers = Array.isArray(preHandler)
    ? preHandler
    : preHandler
    ? [preHandler]
    : [];
  (router as any)[method](url, ...handlers, handler);
};
