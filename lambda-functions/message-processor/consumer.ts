import { ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { SQSEvent } from "aws-lambda";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { queue } from "../../shared/config/queue";
const Logger = logger("handler");

export const handler = async (sqsEvent: SQSEvent) => {
  await connectToDatabase();
  Logger("handler").debug(JSON.stringify({ sqsEvent }));
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.AWS_SQS_URL as string,
    MaxNumberOfMessages: 1,
    AttributeNames: ["All"],
    MessageSystemAttributeNames: ["All"],
    MessageAttributeNames: ["All"],
  });
  const data = await queue.send(command);
  Logger("handler").debug(JSON.stringify(data));
};
