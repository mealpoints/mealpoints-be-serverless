import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import * as mealReportService from "../../../shared/services/mealReport.service";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";

const Logger = logger("report.controller");

interface IGetMealReportRequest extends Request {
  params: {
    mealReportId: string;
  };
}

export const getMealReport = catchAsync(
  async (request: IGetMealReportRequest, response: Response) => {
    Logger("getReport").info("");
    const { mealReportId } = request.params;
    const mealReport = await mealReportService.getMealReportById(mealReportId);
    if (!mealReport) {
      return ApiResponse.NotFound(response, "Meal report not found");
    }
    return ApiResponse.Ok(response, mealReport);
  }
);
