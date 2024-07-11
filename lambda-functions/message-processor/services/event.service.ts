import { SQSEvent, SQSRecord } from "aws-lambda";
import logger from "../../../shared/config/logger";
import { SqsQueueService } from "../../../shared/services/queue.service";
import {
  IDequeuedMessage,
  IMessage,
} from "../../../shared/types/queueMessages";
import { processWhatsappWebhook } from "../lib/whatsapp";

const Logger = logger("event.service");

export class EventService {
  constructor(private readonly queueService: SqsQueueService) {}

  async handle(event: SQSEvent) {
    // Get parsed messages from the event
    const dequeuedMessages = this.mapEventToDequeuedMessages(event);
    const messagesToDelete: IDequeuedMessage[] = [];

    const promises = dequeuedMessages.map(async (message: IDequeuedMessage) => {
      try {
        await this.processMessage(message);
        messagesToDelete.push(message);
      } catch (error) {
        Logger("handler").error(error);
      }
    });
    // await until all messages have been processed
    await Promise.all(promises);

    // Delete successful messages manually if other processings failed
    const numberRetriableMessages =
      dequeuedMessages.length - messagesToDelete.length;
    if (numberRetriableMessages > 0) {
      await this.queueService.deleteMessages(
        process.env.AWS_SQS_URL as string,
        messagesToDelete
      );
      const errorMessage = `Failing due to ${numberRetriableMessages} unsuccessful and retriable errors.`;
      Logger("handler").error(errorMessage);
    }
  }
  private async processMessage(message: IDequeuedMessage) {
    await processWhatsappWebhook(message.body);
  }

  private mapEventToDequeuedMessages(event: SQSEvent): IDequeuedMessage[] {
    return event.Records.map((record: SQSRecord) => {
      const message: IMessage = JSON.parse(record.body);
      return {
        id: record.messageId,
        receiptHandle: record.receiptHandle,
        ...message,
      };
    });
  }
}
