import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import SettingsSingleton from "../../../shared/config/settings";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";

const Logger = logger("bff.controller");

export const home = catchAsync(async (request: Request, response: Response) => {
  Logger("home").info("");
  const allSettings = await SettingsSingleton.getInstance();

  const settings = {
    planId: allSettings.get("ui.home.plan") as string,
  };

  return ApiResponse.Ok(response, {
    settings,
  });
});
