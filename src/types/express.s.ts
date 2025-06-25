import { RequestHandler } from "express";

export type AppHandler<
  ReqParams = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, string>
> = RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>;
