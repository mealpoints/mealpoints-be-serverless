import { FilterQuery } from "mongoose";
import logger from "../config/logger";
import MealReport, {
  IMealReport,
  IMealReportCreate,
} from "../models/mealReport.model";

const Logger = logger("mealReport.service");

export const createMealReport = async (
  mealReport: IMealReportCreate
): Promise<IMealReport> => {
  try {
    Logger("createMealReport").info("");
    const newMealReport = await MealReport.create(mealReport);
    return newMealReport;
  } catch (error) {
    Logger("createMealReport").error(error);
    throw error;
  }
};

export const getMealReportById = async (
  mealReportId: string
): Promise<IMealReport | null> => {
  try {
    Logger("getMealReportById").info("");
    const mealReport = await MealReport.findById(
      mealReportId,
      {},
      {
        populate: ["bestMeals", "worstMeals", "user"],
      }
    );
    return mealReport;
  } catch (error) {
    Logger("getMealReportById").error(error);
    throw error;
  }
};

export const findMealReport = async (
  filter: FilterQuery<IMealReport>
): Promise<IMealReport[] | []> => {
  try {
    Logger("findMealReport").info("");
    const mealReport = await MealReport.find(filter);
    return mealReport;
  } catch (error) {
    Logger("findMealReport").error(error);
    throw error;
  }
};

export const getPreviousWeekMealReportForUser = async (userId: string, startDate: Date) => {
  try {
    Logger("findMealReportOfPreviousWeek").info("");
    const mealReport = await MealReport.findOne({
      user: userId,
      startDate: {
        $gte: startDate,
      }
    });
    return mealReport;
  } catch (error) {
    Logger("findMealReportOfPreviousWeek").error(error);
    throw error;
  }
};
