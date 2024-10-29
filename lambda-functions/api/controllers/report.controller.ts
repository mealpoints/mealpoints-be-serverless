import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";

const Logger = logger("report.controller");

interface ICreateReportRequest extends Request {
  params: {
    reportId: string;
  };
}

export const getReport = catchAsync(
  async (req: ICreateReportRequest, res: Response) => {
    const { reportId } = req.params;
    return ApiResponse.Ok(res, reportId);
  }
);
