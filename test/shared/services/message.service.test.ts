import logger from "../../../shared/config/logger";
import * as messageService from "../../../shared/services/message.service";
import {
  ButtonReplyEnum,
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

    it("should send flow template", async () => {
      const dataService = DataService.getInstance();
      const userId = dataService.getUser().id;

      const response = await messageService.sendTemplateMessage({
        user: userId,
        type: MessageTypesEnum.Template,
        template: createWhatsappTemplate(
          WhatsappTemplateNameEnum.OnboardingV1,
          {}
        ),
      });

      Logger("sendTemplateMessage").info(JSON.stringify(response.data.error));
      expect(response.data).toBeDefined();
    });
  });

  it("should send Interactive CTA Message", async () => {
    const dataService = DataService.getInstance();
    const userId = dataService.getUser().id;

    const response = await messageService.sendInteractiveMessage({
      user: userId,
      type: MessageTypesEnum.Interactive,
      interactive: {
        type: "cta_url",
        header: {
          type: "text",
          text: "Interactive Message",
        },
        body: {
          text: "This is an interactive message",
        },
        footer: {
          text: "Footer",
        },
        action: {
          name: "cta_url",
          parameters: {
            display_text: "Click here",
            url: "https://www.google.com",
          },
        },
      },
    });

    Logger("sendInteractiveMessage").info(JSON.stringify(response.data));
    expect(response.data).toBeDefined();
  });

  it("should send Interactive reply Message", async () => {
    const dataService = DataService.getInstance();
    const userId = dataService.getUser().id;

    const response = await messageService.sendInteractiveMessage({
      user: userId,
      type: MessageTypesEnum.Interactive,
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "Interactive Message with Reply",
        },
        body: {
          text: "This is an interactive message with reply",
        },
        footer: {
          text: "Footer",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: ButtonReplyEnum.RefundConfirmed,
                title: "Yes",
              },
            },
            {
              type: "reply",
              reply: {
                id: ButtonReplyEnum.RefundRejected,
                title: "No",
              },
            },
          ],
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
