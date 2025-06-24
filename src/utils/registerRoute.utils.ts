import { Router, RequestHandler, NextFunction, Response } from "express";

interface ExpressRouteOptions {
  method: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  preHandler?: RequestHandler | RequestHandler[];
  handler: RequestHandler;
}

export const registerRoute = (
  router: Router,
  { method, url, preHandler, handler }: ExpressRouteOptions
) => {
  const handlers = Array.isArray(preHandler)
    ? preHandler
    : preHandler
    ? [preHandler]
    : [];
  (router as any)[method](url, ...handlers, handler);
};
