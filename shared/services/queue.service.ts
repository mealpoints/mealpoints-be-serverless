import {
  DeleteMessageCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import logger from "../config/logger";
import { IDequeuedMessage } from "../types/queueMessages";

const Logger = logger("queue.service");

interface IEnqueueMessage {
  queueUrl: string;
  messageBody: string;
  messageGroupId: string;
  messageDeduplicationId: string;
}

export class SqsQueueService {
  constructor(private readonly sqsClient: SQSClient) {}

  // Enqueue a message to the SQS queue
  async enqueueMessage({
    queueUrl,
    messageBody,
    messageGroupId,
    messageDeduplicationId,
  }: IEnqueueMessage) {
    const message = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: messageDeduplicationId,
    });
    const result = await this.sqsClient.send(message);
    Logger("enqueueMessage").info(
      `Message queued with id: ${result.MessageId}`
    );
    return {
      id: result.MessageId || "",
      ...message,
    };
  }

  // Delete a message from the SQS queue
  async deleteMessage(queueUrl: string, receiptHandle: string) {
    const deleteMessageCommand = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });
    await this.sqsClient.send(deleteMessageCommand);
  }

  // Delete multiple messages from the SQS queue
  async deleteMessages(queueUrl: string, dequeuedMessages: IDequeuedMessage[]) {
    if (dequeuedMessages.length <= 0) {
      return;
    }
    // TODO: Wrap this in try catch block
    for (const dequeuedMessage of dequeuedMessages) {
      await this.deleteMessage(queueUrl, dequeuedMessage.receiptHandle);
    }
  }
}
