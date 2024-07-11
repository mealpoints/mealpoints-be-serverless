import { WebhookTypesEnum } from "../types/enums";
import { WebhookObject } from "../types/message";

export type WebhookMessageType = "inboundMessage" | "statusUpdate" | undefined;

export class WhatsappData {
  private _webhookMessageType: WebhookMessageType;
  private _webhookType: WebhookTypesEnum;

  constructor(private data: WebhookObject) {
    this._webhookMessageType = this.getWebhookMessageType();
    this._webhookType = this.categoriseInboundMessageWebhook();
  }

  private getWebhookMessageType(): WebhookMessageType {
    const isInboundMessage = !!this.data.entry[0].changes[0].value.messages;
    const isStatusUpdate = !!this.data.entry[0].changes[0].value.statuses;

    if (isInboundMessage) {
      return "inboundMessage";
    } else if (isStatusUpdate) {
      return "statusUpdate";
    }
  }

  get isInboundMessage(): boolean {
    return this._webhookMessageType === "inboundMessage";
  }

  get isStatusUpdate(): boolean {
    return this._webhookMessageType === "statusUpdate";
  }

  get webhookMessageType(): WebhookMessageType {
    return this._webhookMessageType;
  }

  private categoriseInboundMessageWebhook(): WebhookTypesEnum {
    switch (this.data.entry[0].changes[0].value.messages?.[0].type) {
      case WebhookTypesEnum.Text: {
        return WebhookTypesEnum.Text;
      }
      case WebhookTypesEnum.Audio: {
        return WebhookTypesEnum.Audio;
      }
      case WebhookTypesEnum.Document: {
        return WebhookTypesEnum.Document;
      }
      case WebhookTypesEnum.Image: {
        return WebhookTypesEnum.Image;
      }
      case WebhookTypesEnum.Interactive: {
        return WebhookTypesEnum.Interactive;
      }
      case WebhookTypesEnum.Sticker: {
        return WebhookTypesEnum.Sticker;
      }
      case WebhookTypesEnum.Video: {
        return WebhookTypesEnum.Video;
      }
      default: {
        return WebhookTypesEnum.Unknown;
      }
    }
  }

  get webhookType(): WebhookTypesEnum {
    return this._webhookType;
  }

  get whatsappMessageId(): string | undefined {
    if (this._webhookMessageType === "inboundMessage") {
      return this.data.entry[0].changes[0].value.messages?.[0].id as string;
    } else if (this._webhookMessageType === "statusUpdate") {
      return this.data.entry[0].changes[0].value.statuses?.[0].id as string;
    }
  }

  get phoneNumberId(): string {
    return this.data.entry[0].changes[0].value.metadata.phone_number_id;
  }

  get contact(): string | undefined {
    if (this._webhookMessageType === "statusUpdate")
      return this.data.entry[0].changes[0].value.statuses?.[0]
        .recipient_id as string;
    if (this._webhookMessageType === "inboundMessage")
      return this.data.entry[0].changes[0].value.messages?.[0].from as string;
  }

  get userMessage(): string | undefined {
    if (this._webhookType !== WebhookTypesEnum.Text) return undefined;
    return this.data.entry[0].changes[0].value.messages?.[0].text
      ?.body as string;
  }

  get imageId(): string | undefined {
    if (this._webhookType !== WebhookTypesEnum.Image) return undefined;
    return this.data.entry[0].changes[0].value.messages?.[0].image
      ?.id as string;
  }

  public isMessageFromWatsappPhoneNumberId(
    whatsappPhoneNumberId: string
  ): boolean {
    return this.phoneNumberId === whatsappPhoneNumberId;
  }
}
