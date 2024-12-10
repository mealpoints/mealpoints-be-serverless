import { subDays } from "date-fns";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import {
  IMealReportCreate,
  IMealReportFromOpenAI,
} from "../../../../shared/models/mealReport.model";
import { IUser } from "../../../../shared/models/user.model";
import * as mealReportService from "../../../../shared/services/mealReport.service";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import * as userMealService from "../../../../shared/services/userMeal.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
  UserEngagementMessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";
import {
  getBadgeData,
  getMetadata,
  getSummary,
  getTop3BestAndWorstMeals,
  validateOpenAIResult,
} from "./util";

const Logger = logger("lib/reminder/meal-report");

export const processMealReport = async (user: IUser): Promise<void> => {
  Logger("processMealReport").info("");
  const settings = await SettingsSingleton.getInstance();
  const assistantId = settings.get("openai.assistant.meal-reports") as string;

  try {
    const oneWeekAgo = subDays(new Date(), 7);
    const today = new Date();

    const meals = await userMealService.getUserMealsInPeriod(
      user.id,
      oneWeekAgo,
      today
    );

    const stringifiedMeals = JSON.stringify(meals);

    const openAIResult = (await openAIService.ask(stringifiedMeals, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
    })) as unknown as IMealReportFromOpenAI;

    // validate openAIResult
    if (!validateOpenAIResult(openAIResult)) {
      Logger("processMealReport").error(
        `Invalid OpenAI response: ${JSON.stringify(openAIResult)}`
      );
      await sendInternalAlert({
        message: `Invalid OpenAI response: ${JSON.stringify(openAIResult)}`,
        severity: "minor",
      });
      throw new Error("Invalid OpenAI response");
    }

    const { tipsToImproveScore, failuresToAvoid } = openAIResult;

    const twoWeeksAgo = subDays(oneWeekAgo, 7);

    const previousWeekMealReport =
      await mealReportService.getPreviousWeekMealReportForUser(user.id, twoWeeksAgo);

    const previousWeekAverageScore: number | undefined =
      (previousWeekMealReport && previousWeekMealReport.summary.averageScore) ||
      undefined;

    const { bestMeals, worstMeals } = getTop3BestAndWorstMeals(meals);
    const metadata = getMetadata(meals);
    const summary = getSummary(meals, previousWeekAverageScore);
    const { personalityBadge, mealWins } = getBadgeData(
      openAIResult.personalityBadge,
      openAIResult.mealWins
    );

    const finalMealReport: IMealReportCreate = {
      user: user.id,
      startDate: oneWeekAgo,
      endDate: today,
      summary,
      metadata,
      bestMeals,
      worstMeals,
      tipsToImproveScore,
      failuresToAvoid,
      personalityBadge,
      mealWins,
    };

    // Store the meal report in the database
    const mealReport = await mealReportService.createMealReport(
      finalMealReport
    );

    Logger("processMealReport").info(`Meal report created: ${mealReport.id}`);

    // Send the notification to the user letting him know that the meal report is ready
    const messageResponse = await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(WhatsappTemplateNameEnum.MealReport, {
        mealReportId: mealReport.id,
      }),
    });

    if (messageResponse) {
      Logger("processMealSummary").info(
        `Successfully sent meal summary to user ${user.id}`
      );

      await userEngagementMessageService.createUserEngagementMessage({
        user: user.id,
        content: `Template: ${WhatsappTemplateNameEnum.MealReport}`,
        type: UserEngagementMessageTypesEnum.MealReport,
      });
    }
  } catch (error) {
    Logger("processMealReport").error(error);
    throw error;
  }
};
