import { StatusEnum } from "../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../shared/types/message";

export const READ_MESSAGE_UPDATE: WhastappWebhookObject = {
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
            statuses: [
              {
                id: "wamid.HBgMOTE3MDIyNjI5OTM5FQIAERgSQzY3ODU4QUE2OTUwRjA1QThGAA==",
                status: StatusEnum.Read,
                timestamp: "1717791027",
                recipient_id: "917022629939",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};
