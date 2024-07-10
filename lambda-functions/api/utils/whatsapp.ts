import { WebhookObject } from "../../../shared/types/message";

export const getWhatsappMessageId = (
  payload: WebhookObject
): string | undefined => {
  const isInboundMessage = !!payload.entry[0].changes[0].value.messages;
  const isStatusUpdate = !!payload.entry[0].changes[0].value.statuses;
  if (isInboundMessage) {
    return payload.entry[0].changes[0].value.messages?.[0].id as string;
  }
  if (isStatusUpdate) {
    return payload.entry[0].changes[0].value.statuses?.[0].id as string;
  }
};
