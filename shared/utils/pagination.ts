import { Request } from "express";
import { PaginateOptions } from "./mongoosePlugins";

export const extractPaginationOptions = (
  query: Request["query"]
): PaginateOptions => {
  const page = query.page ? Number.parseInt(query.page as string) : 1;
  const limit = query.limit ? Number.parseInt(query.limit as string) : 10;
  const sort = query.sort ? JSON.parse(query.sort as string) : {};
  return { page, limit, sort };
};
