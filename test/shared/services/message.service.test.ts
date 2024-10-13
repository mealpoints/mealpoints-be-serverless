import logger from "../../../shared/config/logger";
import * as messageService from "../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../shared/types/enums";
import { DataService } from "../../test_utils/DataService";
const Logger = logger("test/shared/services/message.service.test");

describe("Message Service", () => {
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

    Logger("sendInteractiveMessage").info(response.data);
    expect(response).toBeDefined();
  });

  it("should send Text Message", async () => {
    const dataService = DataService.getInstance();
    const userId = dataService.getUser().id;
    const response = await messageService.sendTextMessage({
      user: userId,
      type: MessageTypesEnum.Text,
      payload: "Hello, how can I help you?",
    });

    Logger("sendTextMessage").info(response.data);
    expect(response).toBeDefined();
  });
});
