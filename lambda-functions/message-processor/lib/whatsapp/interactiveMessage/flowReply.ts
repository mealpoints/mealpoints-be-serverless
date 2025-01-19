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
import { userPreferences } from "../flows/userPreferences";

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
      case WhatsappFlowEnum.UserPreferencesV1: {
        Logger("flowReply").info("UserPreferencesV1");
        await userPreferences(parsedReply, user);
        break;
      }
      default: {
        Logger("flowReply").info("default");
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
