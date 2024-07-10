/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

export const catchAsync =
  (_function: any) =>
  (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(_function(request, response, next)).catch((error) =>
      next(error)
    );
  };
