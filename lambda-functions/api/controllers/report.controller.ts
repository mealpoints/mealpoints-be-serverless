import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import * as reportService from "../../../shared/services/report.service";
import * as userService from "../../../shared/services/user.service";
import { ReportPeriod } from "../../../shared/types/report";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";

const Logger = logger("report.controller");

interface ICreateReportRequest extends Request {
  query: {
    period: ReportPeriod;
    userId: string;
  };
}
export const createReport = catchAsync(
  async (request: ICreateReportRequest, response: Response) => {
    Logger("createReport").debug("");
    const { period, userId } = request.query;

    const user = await userService.getUserById(userId);
    if (!user) {
      return ApiResponse.NotFound(response, "User not found");
    }

    const report = await reportService.getReport(userId, period);

    return ApiResponse.Ok(response, report);
  }
);
