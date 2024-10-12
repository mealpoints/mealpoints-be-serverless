import { WebhookTypesEnum } from "../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../shared/types/message";

export const TEXT_MESSAGE_PAYLOAD: WhastappWebhookObject = {
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
              phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID as string,
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
