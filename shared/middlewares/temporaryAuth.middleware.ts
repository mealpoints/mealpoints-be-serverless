import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse";

const temporaryAuthToken = process.env.TEMPORARY_AUTH_TOKEN as string;
export const temporaryAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.headers.authorization !== temporaryAuthToken) {
    return ApiResponse.Unauthorized(response);
  }
  next();
};
