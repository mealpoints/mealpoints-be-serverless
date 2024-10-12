/* eslint-disable unicorn/filename-case */
import { SQSEvent } from "aws-lambda";

export class SQSEventData {
  constructor(private event: SQSEvent) {}

  public isMessageGroupId(messageGroupId: string) {
    return this.event.Records[0].attributes.MessageGroupId === messageGroupId;
  }

  get messageGroupId() {
    return this.event.Records[0].attributes.MessageGroupId;
  }
}
