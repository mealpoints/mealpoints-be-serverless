import { WebhookTypesEnum } from "../../../src/types/enums";
import { WebhookObject } from "../../../src/types/message";

export const TEXT_MESSAGE_PAYLOAD: WebhookObject = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "100566076126991",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "15550992151",
              phone_number_id: "100498292800637",
            },
            contacts: [
              { profile: { name: "Madhav Sharma" }, wa_id: "917022629939" },
            ],
            messages: [
              {
                from: "917022629939",
                id: "wamid.HBgMOTE3MDIyNjI5OTM5FQIAEhgWM0VCMDAwQTA0MjUxNkI3RTRBQTMzMQA=",
                timestamp: "1717708148",
                text: { body: "hey there" },
                type: WebhookTypesEnum.Text,
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};
