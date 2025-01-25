import logger from "../../../../../shared/config/logger";
import SettingsSingleton from "../../../../../shared/config/settings";
import { IUser } from "../../../../../shared/models/user.model";
import * as messageService from "../../../../../shared/services/message.service";
import * as nutritionBudgetService from "../../../../../shared/services/nutritionBudget.service";
import * as openAIService from "../../../../../shared/services/openAI.service";
import {
  GenderEnum,
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
  PhysicalActivityEnum,
} from "../../../../../shared/types/enums";
import { IWeightLossTargetResponse } from "../../../../../shared/types/openai";
import { convertToHumanReadableMessage } from "../../../../../shared/utils/string";
import { getDate, getNumber } from "./utils";

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

export const onboardingV1 = async (
  parsedReply: IOnboardingV1ParsedReply,
  user: IUser
) => {
  Logger("onboardingV1").info("");
  try {
    const {
      screen_1_Target_Weight_0,
      screen_1_Target_Date_1,
      screen_0_Birthdate_0,
      screen_0_Gender_1,
      screen_0_Height_2,
      screen_0_Current_Weight_3,
      screen_0_Physical_Activity_4,
    } = parsedReply;

    const currentWeight = getNumber(
      screen_0_Current_Weight_3 as string
    ) as number;
    const height = getNumber(screen_0_Height_2 as string);
    const targetWeight = getNumber(
      screen_1_Target_Weight_0 as string
    ) as number;
    const birthDate = getDate(screen_0_Birthdate_0 as string);
    const targetDate = getDate(screen_1_Target_Date_1 as string) as Date;
    const gender = getGender(screen_0_Gender_1 as string);
    const physicalActivity = getPhysicalActivity(
      screen_0_Physical_Activity_4 as string
    );

    const prompt = JSON.stringify({
      currentWeight,
      height,
      targetWeight,
      birthDate: birthDate?.toLocaleDateString(),
      currentDate: new Date().toLocaleDateString(),
      targetDate: targetDate?.toLocaleDateString(),
      gender,
      physicalActivity,
    });

    const settings = await SettingsSingleton.getInstance();
    const assistantId = settings.get(
      "openai.assistant.goal-setting-coach"
    ) as string;

    const response = (await openAIService.ask(prompt, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
    })) as IWeightLossTargetResponse;

    await nutritionBudgetService.createNutritionBudget({
      user: user.id,
      calories: response.target.calories,
      protein: response.target.protein,
      fat: response.target.fats,
      carbohydrates: response.target.carbs,
      targetWeight,
      targetDate,
      currentWeight,
    });

    await messageService.sendTextMessage({
      user: user.id,
      payload: convertToHumanReadableMessage(response.message),
      type: MessageTypesEnum.Text,
    });
  } catch (error) {
    Logger("onboardingV1").error(error);
    throw error;
  }
};
