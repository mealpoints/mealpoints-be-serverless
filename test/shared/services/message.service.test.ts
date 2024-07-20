import * as messageService from "../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../shared/types/enums";

describe("Message Service", () => {
  it("shold send Interactive Message", async () => {
    const response = await messageService.sendInteractiveMessage({
      user: "66903c69fc2f6a42f733b5d4",
      payload: "test",
      conversation: "66903c69fc2f6a42f733b5d7",
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
