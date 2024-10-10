import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import { ISetting, SettingValue } from "../../../shared/models/setting.model";
import * as settingService from "../../../shared/services/setting.service";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";

const Logger = logger("setting.controller");

export const createSetting = catchAsync(
  async (request: Request, response: Response) => {
    Logger("createSetting").info(request.body);
    const { key, value }: ISetting = request.body;
    const setting = await settingService.createSetting({ key, value });
    return ApiResponse.Ok<typeof setting>(response, setting);
  }
);

export const getSettings = catchAsync(
  async (request: Request, response: Response) => {
    Logger("getSettings").info("");
    const settings = await settingService.getSettings();
    return ApiResponse.Ok<typeof settings>(response, settings);
  }
);

export const getSettingsByKey = catchAsync(
  async (request: Request, response: Response) => {
    Logger("getSettingsByKey").info(request.params.key);
    const key = request.params.key;
    const setting = await settingService.getSettingByKey(key);
    return ApiResponse.Ok<SettingValue>(response, setting?.value);
  }
);

export const updateSetting = catchAsync(
  async (request: Request, response: Response) => {
    Logger("updateSetting").info(request.body);
    const { key, value }: ISetting = request.body;
    await settingService.updateSetting({ key, value });
    return ApiResponse.NoContent(response);
  }
);
