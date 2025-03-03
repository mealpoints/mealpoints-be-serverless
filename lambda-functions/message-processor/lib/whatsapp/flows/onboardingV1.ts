import { analyticsClient } from "../../../../../shared/config/analytics";
import { USER_MESSAGES } from "../../../../../shared/config/config";
import logger from "../../../../../shared/config/logger";
import { IUser } from "../../../../../shared/models/user.model";
import * as messageService from "../../../../../shared/services/message.service";
import * as nutritionBudgetService from "../../../../../shared/services/nutritionBudget.service";
import * as userPreferencesService from "../../../../../shared/services/userPreferences.service";
import {
  GenderEnum,
  HeightUnitEnum,
  MessageTypesEnum,
  PhysicalActivityEnum,
  WeightUnitEnum,
} from "../../../../../shared/types/enums";
import {
  calculateNutritionBudget,
  getAge,
  getDate,
  getDurationMonths,
  getNumber,
} from "./utils";

const Logger = logger("flowReply/onboardingV1");

const getGender = (gender_: string) => {
  if (
    gender_ === undefined ||
    typeof gender_ !== "string" ||
    gender_.trim() === ""
  )
    return undefined;

  switch (gender_) {
    case "0_Male": {
      return GenderEnum.Male;
    }
    case "1_Female": {
      return GenderEnum.Female;
    }
    case "2_Other": {
      return GenderEnum.Other;
    }
    default: {
      return undefined;
    }
  }
};

const getPhysicalActivity = (physicalActivity_: string) => {
  if (
    physicalActivity_ === undefined ||
    typeof physicalActivity_ !== "string" ||
    physicalActivity_.trim() === ""
  )
    return undefined;

  switch (physicalActivity_) {
    case "0_Chill_and_Still": {
      return PhysicalActivityEnum.Sedentary;
    }
    case "1_Occasional_Walker": {
      return PhysicalActivityEnum.Light;
    }
    case "2_Weekend_Hustler": {
      return PhysicalActivityEnum.Moderate;
    }
    case "3_Workout_Lover": {
      return PhysicalActivityEnum.Active;
    }
    case "4_Fitness_Fanatic": {
      return PhysicalActivityEnum.VeryActive;
    }
    default: {
      return undefined;
    }
  }
};

export interface IOnboardingV1ParsedReply {
  screen_1_Target_Weight_0?: string;
  screen_1_Target_Date_1?: string;
  screen_0_Birthdate_0?: string;
  screen_0_Gender_1?: string;
  screen_0_Height_2?: string;
  screen_0_Current_Weight_3?: string;
  screen_0_Physical_Activity_4?: string;
}

export const validateOnboardingInputs = (
  parsedReply: IOnboardingV1ParsedReply
) => {
  const {
    screen_1_Target_Weight_0,
    screen_1_Target_Date_1,
    screen_0_Birthdate_0,
    screen_0_Gender_1,
    screen_0_Height_2,
    screen_0_Current_Weight_3,
    screen_0_Physical_Activity_4,
  } = parsedReply;

  const currentWeight = getNumber(screen_0_Current_Weight_3 as string);
  const height = getNumber(screen_0_Height_2 as string);
  const targetWeight = getNumber(screen_1_Target_Weight_0 as string);
  const birthDate = getDate(screen_0_Birthdate_0 as string);
  const targetDate = getDate(screen_1_Target_Date_1 as string);
  const gender = getGender(screen_0_Gender_1 as string);
  const physicalActivity = getPhysicalActivity(
    screen_0_Physical_Activity_4 as string
  );

  // Check for any missing or invalid fields which is essential for further calculations
  const errors: string[] = [];
  if (currentWeight === undefined)
    errors.push("Current Weight is missing or invalid");
  if (height === undefined) errors.push("Height is missing or invalid");
  if (targetWeight === undefined)
    errors.push("Target Weight is missing or invalid");
  if (birthDate === undefined) errors.push("Birthdate is missing or invalid");
  if (targetDate === undefined)
    errors.push("Target Date is missing or invalid");
  if (gender === undefined) errors.push("Gender is missing or invalid");
  if (physicalActivity === undefined)
    errors.push("Physical Activity is missing or invalid");

  if (errors.length > 0) {
    throw new Error(`Validation Error(s): \n ${errors.join("\n")}`);
  }

  return {
    currentWeight: currentWeight as number,
    height: height as number,
    targetWeight: targetWeight as number,
    birthDate: birthDate as Date,
    targetDate: targetDate as Date,
    gender: gender as GenderEnum,
    physicalActivity: physicalActivity as PhysicalActivityEnum,
  };
};

export const onboardingV1 = async (
  parsedReply: IOnboardingV1ParsedReply,
  user: IUser
) => {
  Logger("onboardingV1").info("Starting onboarding process ✨");
  try {
    const {
      currentWeight,
      height,
      targetWeight,
      birthDate,
      targetDate,
      gender,
      physicalActivity,
    } = validateOnboardingInputs(parsedReply);

    await userPreferencesService.createUserPreferences({
      user: user.id,
      birthDate,
      height: {
        value: height,
        unit: HeightUnitEnum.CM,
      },
      currentWeight: {
        value: currentWeight,
        unit: WeightUnitEnum.KG,
      },
      goalWeight: {
        value: targetWeight,
        unit: WeightUnitEnum.KG,
      },
      gender,
      physicalActivity,
    });

    const age = getAge(birthDate);
    const durationMonths = getDurationMonths(targetDate);
    if (age === undefined || durationMonths === undefined) {
      throw new Error(
        "Unable to calculate age or duration months due to invalid date inputs"
      );
    }

    const calculatedBudget = calculateNutritionBudget({
      currentWeight,
      height,
      age,
      gender,
      physicalActivity,
      targetWeight,
      durationMonths,
    });

    await nutritionBudgetService.createNutritionBudget({
      user: user.id,
      calories: calculatedBudget.calories,
      protein: calculatedBudget.protein,
      fat: calculatedBudget.fat,
      carbohydrates: calculatedBudget.carbohydrates,
      targetWeight,
      targetDate,
      currentWeight,
    });

    await messageService.sendTextMessage({
      user: user.id,
      payload:
        USER_MESSAGES.info.welcome.notify_nutrition_budget(calculatedBudget),
      type: MessageTypesEnum.Text,
    });

    analyticsClient.capture({
      distinctId: user.id,
      event: "onboarding_v1_completed",
      properties: {
        prefences: {
          age,
          height,
          currentWeight,
          targetDate,
          targetWeight,
          birthDate,
          gender,
          physicalActivity,
        },
        budget: {
          ...calculatedBudget,
        },
      },
    });

    Logger("onboardingV1").info("Onboarding process completed successfully 🎉");
  } catch (error) {
    Logger("onboardingV1").error(error);
    throw error;
  }
};
