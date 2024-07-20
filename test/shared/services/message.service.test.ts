import * as messageService from "../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../shared/types/enums";
import { CONVERSATION } from "../../mocks/conversation.mock";
import { USER } from "../../mocks/user.mock";

describe("Message Service", () => {
  it("shold send Interactive Message", async () => {
    const response = await messageService.sendInteractiveMessage({
      user: USER.id,
      conversation: CONVERSATION.id,
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
    console.log(response.data);

    expect(response).toBeDefined();
  });
});
