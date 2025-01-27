import logger from "../config/logger";
import DailyNutritionTracker, {
  IDailyNutritionTracker,
  IDailyNutritionTrackerCreate,
} from "../models/dailyNutritionTracker.model";

const Logger = logger("dailyNutritionTracker.service");

export const createDailyNutritionTracker = async (
  data: IDailyNutritionTrackerCreate
): Promise<IDailyNutritionTracker> => {
  try {
    Logger("createDailyNutritionTracker").info("");
    const dailyNutritionTracker = await DailyNutritionTracker.create(data);
    return dailyNutritionTracker;
  } catch (error) {
    Logger("createDailyNutritionTracker").error(JSON.stringify(error));
    throw error;
  }
};

export const updateDailyNutritionTracker = async (
  data: IDailyNutritionTracker
): Promise<IDailyNutritionTracker> => {
  try {
    Logger("updateDailyNutritionTracker").info("");

    const dailyNutritionTracker = await DailyNutritionTracker.findByIdAndUpdate(
      data.id,
      data,
      { new: true }
    );

    if (!dailyNutritionTracker) {
      throw new Error(`DailyNutritionTracker not found for id: ${data.id}`);
    }

    return dailyNutritionTracker;
  } catch (error) {
    Logger("updateDailyNutritionTracker").error(JSON.stringify(error));
    throw error;
  }
};

export const getDailyNutritionTrackerByUser = async (
  user: string,
  date: Date
): Promise<IDailyNutritionTracker | null> => {
  try {
    Logger("getDailyNutritionTrackerByUser").info("");
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyNutritionTracker = await DailyNutritionTracker.findOne({
      user,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    return dailyNutritionTracker;
  } catch (error) {
    Logger("getDailyNutritionTrackerByUser").error(JSON.stringify(error));
    throw error;
  }
};
