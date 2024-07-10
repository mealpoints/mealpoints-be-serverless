import { SQSClient } from "@aws-sdk/client-sqs";

export const queue = new SQSClient({
  region: process.env.AWS_REGION,
});
