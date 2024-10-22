import { SQSEvent } from "aws-lambda";
import logger from "../../../shared/config/logger";
import { SqsQueueService } from "../../../shared/services/queue.service";
import { IDequeuedMessage } from "../../../shared/types/queueMessages";

const Logger = logger("event.service");

export class EventService<T> {
  constructor(
    private queueService: SqsQueueService,
    private processMessageFunction: (messageBody: T) => Promise<void> // Injected function
  ) { }

  async handle(event: SQSEvent) {
    const dequeuedMessages = this.mapEventToDequeuedMessages(event);
    const messagesToDelete: IDequeuedMessage[] = [];

    const promises = dequeuedMessages.map(async (message) => {
      try {
        await this.processMessageFunction(message.body as T);
        messagesToDelete.push(message);
      } catch (error) {
        Logger("handler").error(error);
      }
    });

    await Promise.all(promises);

    const failedMessages = dequeuedMessages.length - messagesToDelete.length;
    if (failedMessages > 0) {
      await this.queueService.deleteMessages(
        process.env.AWS_SQS_URL!,
        messagesToDelete
      );

      Logger("handler").error(
        `Failing due to ${failedMessages} unsuccessful messages.`
      );
    }
  }

  private mapEventToDequeuedMessages(event: SQSEvent): IDequeuedMessage[] {
    return event.Records.map((record) => ({
      id: record.messageId,
      receiptHandle: record.receiptHandle,
      ...JSON.parse(record.body),
    }));
  }
}
