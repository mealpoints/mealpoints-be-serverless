import * as _ from "lodash";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import { IUserMeal } from "../../../../shared/models/userMeal.model";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import { findUserMeals } from "../../../../shared/services/userMeal.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
  UserEngagementMessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { IUsersToSendSummaries } from "../../../../shared/types/queueMessages";
import { DateUtils } from "../../../../shared/utils/DateUtils";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsappTemplateUtils";

const Logger = logger("lib/reminder/meal-summary");

export const calculateMealData = (
  meals: IUserMeal[]
): {
  averageMealScore: string;
  totalCalories: string;
  topMealName: string;
  topMealScore: string;
  topMealCalories: string;
  topMealProtein: string;
  topMealFat: string;
  topMealCarbs: string;
  topMealSugars: string;
  topMealFiber: string;
} => {
  Logger("calculateMealData").info(``);

  let totalCalories = 0;
  let totalScore = 0;

  // Calculate totals
  meals.forEach((meal: IUserMeal) => {
    totalCalories += meal.macros.calories.value;
    totalScore += _.toNumber(meal.score.value);
  });
  const averageMealScore = _.round(totalScore / meals.length, 2);

  // Find top meal by score
  // eslint-disable-next-line unicorn/no-array-reduce
  const topMeal = meals.reduce((previous, current) =>
    previous.score.value > current.score.value ? previous : current
  );

  const topMealName = topMeal.name;
  const topMealScore = topMeal.score.value;
  const topMealCalories = `${topMeal.macros.calories.value}/${topMeal.macros.calories.unit}`;
  const topMealProtein = `${topMeal.macros.protein.value}/${topMeal.macros.protein.unit}`;
  const topMealFat = `${topMeal.macros.fat.value}/${topMeal.macros.fat.unit}`;
  const topMealCarbs = `${topMeal.macros.carbohydrates.value}/${topMeal.macros.carbohydrates.unit}`;
  const topMealFiber = `${topMeal.macros.fiber.value}/${topMeal.macros.fiber.unit}`;
  const topMealSugars = `${topMeal.macros.sugars.value}/${topMeal.macros.sugars.unit}`;
  const totalCaloriesWithUnit = `${totalCalories}/${meals[0].macros.calories.unit}`;

  return {
    averageMealScore: averageMealScore.toString(),
    topMealScore: topMealScore.toString(),
    totalCalories: totalCaloriesWithUnit,
    topMealName,
    topMealCalories,
    topMealProtein,
    topMealFat,
    topMealCarbs,
    topMealSugars,
    topMealFiber,
  };
};

const validateOpenAIResult = (result: object): boolean => {
  const logger = Logger("validateOpenAIResult");

  if (!result) {
    logger.error("No response from OpenAI");
    return false;
  }

  const requiredFields = [
    "analysisOne",
    "analysisTwo",
    "analysisThree",
    "motivation",
  ];

  for (const field of requiredFields) {
    if (!(field in result)) {
      logger.error(`Missing ${field}`);
      return false;
    }
  }

  return true;
};

interface IOpenAIResult {
  analysisOne: string;
  analysisTwo: string;
  analysisThree: string;
  motivation: string;
}

export const processMealSummary = async (user: IUsersToSendSummaries) => {
  Logger("processMealSummary").info(``);

  // TEMP: Remove this once the user object is properly created
  user.id = user.id || (user._id as string);

  const settings = await SettingsSingleton.getInstance();
  const assistantId = settings.get("openai.assistant.meal-summary") as string;
  const engagmentMessageIntervalInDays = settings.get(
    "user-engagement.interval-in-days"
  ) as number;

  const startDate = new DateUtils()
    .subtractDays(engagmentMessageIntervalInDays)
    .toDate();
  const currentDate = new Date();

  try {
    const mealsLoggedByUserInPeriod = await findUserMeals({
      user: user.id,
      createdAt: {
        $gte: startDate,
        $lte: currentDate,
      },
    });

    if (mealsLoggedByUserInPeriod.length === 0) {
      Logger("processMealSummary").info(`No meals logged by user ${user.id}`);
      return;
    }

    const stringifiedMeals = JSON.stringify(mealsLoggedByUserInPeriod);

    const openAIResult = (await openAIService.ask(stringifiedMeals, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
    })) as unknown as IOpenAIResult;

    if (!validateOpenAIResult(openAIResult)) {
      Logger("processMealSummary").error(`Invalid OpenAI response`);
      return;
    }

    const duration =
      engagmentMessageIntervalInDays === 1
        ? "1 day."
        : `${engagmentMessageIntervalInDays} days.`;

    const messageResponse = await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(
        WhatsappTemplateNameEnum.UserMealSummary,
        {
          duration,
          ...calculateMealData(mealsLoggedByUserInPeriod),
          ...openAIResult,
        }
      ),
    });

    if (messageResponse) {
      Logger("processMealSummary").info(
        `Successfully sent meal summary to user ${user.id}`
      );

      await userEngagementMessageService.createUserEngagementMessage({
        user: user.id,
        content: `Template: ${WhatsappTemplateNameEnum.UserMealSummary}`,
        type: UserEngagementMessageTypesEnum.Summary,
      });
    }

    return;
  } catch (error) {
    Logger("processMealSummary").error(error);
    throw error;
  }
};
