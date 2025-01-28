import { USER_MESSAGES } from "../../../../../shared/config/config";
import logger from "../../../../../shared/config/logger";
import { IUser } from "../../../../../shared/models/user.model";
import * as messageService from "../../../../../shared/services/message.service";
import {
  MessageTypesEnum,
  WhatsappFlowEnum,
} from "../../../../../shared/types/enums";
import {
  NFMReplyObject,
  WhastappWebhookObject,
} from "../../../../../shared/types/message";
import { WhatsappData } from "../../../../../shared/utils/WhatsappData";
import { IOnboardingV1ParsedReply, onboardingV1 } from "../flows/onboardingV1";

const Logger = logger("lib/whatsapp/interactiveMessage/flowReply");

export const flowReply = async (
  payload: WhastappWebhookObject,
  user: IUser
) => {
  Logger("flowReply").info("");
  try {
    const { interactiveMessageContent } = new WhatsappData(payload);
    const { nfm_reply } = interactiveMessageContent as NFMReplyObject;
    const parsedReply = JSON.parse(nfm_reply.response_json);

    switch (parsedReply.flow_token) {
      case WhatsappFlowEnum.OnboardingV1: {
        Logger("flowReply").info("OnboardingV1");
        await onboardingV1(parsedReply as IOnboardingV1ParsedReply, user);
        break;
      }
      default: {
        Logger("flowReply").error("flow not found");
        await messageService.sendTextMessage({
          user: user.id,
          payload: USER_MESSAGES.errors.something_went_wrong,
          type: MessageTypesEnum.Text,
        });
        break;
      }
    }
  } catch (error) {
    Logger("flowReply").error(error);
  }
};
