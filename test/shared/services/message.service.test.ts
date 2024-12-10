import logger from "../../../shared/config/logger";
import * as messageService from "../../../shared/services/message.service";
import {
  MessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../shared/utils/whatsapp-templates";
import { DataService } from "../../test_utils/DataService";
const Logger = logger("test/shared/services/message.service.test");

describe("Message Service", () => {
  describe("sendWhatsappTemplate", () => {
    it("should send meal report Template Message", async () => {
      const dataService = DataService.getInstance();
      const userId = dataService.getUser().id;
      try {
        const response = await messageService.sendTemplateMessage({
          user: userId,
          type: MessageTypesEnum.Template,
          template: createWhatsappTemplate(
            WhatsappTemplateNameEnum.MealReport,
            {
              mealReportId: "1234",
            }
          ),
        });

        Logger("sendTemplateMessage").info(JSON.stringify(response.data));
        expect(response.data).toBeDefined();
      } catch (error) {
        console.log(error);
      }
    });

    it("should send Template Message", async () => {
      const dataService = DataService.getInstance();
      const userId = dataService.getUser().id;
      const response = await messageService.sendTemplateMessage({
        user: userId,
        type: MessageTypesEnum.Template,
        template: createWhatsappTemplate(
          WhatsappTemplateNameEnum.UserMealSummary,
          {
            duration: "7 days.",
            averageMealScore: "8.5",
            totalCalories: "2000",
            topMealName: "Pizza",
            topMealScore: "9.5",
            topMealCalories: "500",
            topMealProtein: "20g",
            topMealFat: "10g",
            topMealCarbs: "50g",
            topMealFiber: "5g",
            topMealSugars: "10g",
            analysisOne:
              "Your protein intake was excellent, with a nice balance from both plant and animal sources.",
            analysisTwo:
              "Fiber goals were consistently met, keeping digestion on track and promoting fullness.",
            analysisThree:
              "Healthy fats from nuts, avocado, and fish supported heart health and sustained energy.",
            motivation:
              "Keep up the variety of colourful veggies and protein-rich meals for balanced nutrition!You are doing great! Keep it up!",
          }
        ),
      });

      Logger("sendTemplateMessage").info(JSON.stringify(response.data));
      expect(response.data).toBeDefined();
    });
  });

  it("should send Interactive Message", async () => {
    const dataService = DataService.getInstance();
    const userId = dataService.getUser().id;

    const response = await messageService.sendInteractiveMessage({
      user: userId,
      type: MessageTypesEnum.Interactive,
      interactive: {
        header: "Your report is ready",
        body: "Click below to view the report",
        footer: "Powered by Meal Points",
        action: {
          displayText: "View Report",
          url: "https://google.com",
        },
      },
    });

    Logger("sendInteractiveMessage").info(JSON.stringify(response.data));
    expect(response.data).toBeDefined();
  });

  it("should send Text Message", async () => {
    const dataService = DataService.getInstance();
    const userId = dataService.getUser().id;
    const response = await messageService.sendTextMessage({
      user: userId,
      type: MessageTypesEnum.Text,
      payload: "Hello, how can I help you?",
    });

    Logger("sendTextMessage").info(JSON.stringify(response.data));
    expect(response.data).toBeDefined();
  });
});
