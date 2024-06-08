import {
  ImageMediaTypesEnum,
  WebhookTypesEnum,
} from "../../../src/types/enums";
import { WebhookObject } from "../../../src/types/message";

export const IMAGE_MESSAGE_PAYLOAD: WebhookObject = {
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
                context: { forwarded: true },
                from: "917022629939",
                id: "wamid.HBgMOTE3MDIyNjI5OTM5FQIAEhgWM0VCMDEzODA1QUUwRTQ0ODFENUIzNwA=",
                timestamp: "1717704921",
                type: WebhookTypesEnum.Image,
                image: {
                  mime_type: ImageMediaTypesEnum.Jpeg,
                  sha256: "QXzIk1GzlOXmXl22GcG7DYWqgDjFru0AoogAgAtmufs=",
                  id: "345150251694683",
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};
