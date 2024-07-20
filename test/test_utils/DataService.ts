import logger from "../../shared/config/logger";
import { IConversation } from "../../shared/models/conversation.model";
import { IUser } from "../../shared/models/user.model";
import * as conversationService from "../../shared/services/conversation.service";
import * as userService from "../../shared/services/user.service";
const Logger = logger("test/test_utils/DataService");

export class DataService {
  private static instance: DataService;
  private user: IUser | undefined = undefined;
  private conversation: IConversation | undefined = undefined;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Public method to get the singleton instance
  public static getInstance(): DataService {
    if (!DataService.instance) {
      Logger("getInstance").debug("Creating new instance of DataService");
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public async seed(contact: string): Promise<void> {
    try {
      await this.fetchUserById(contact);
      await this.fetchConversationsByUserId(this.user?.id as string);
    } catch (error) {
      Logger("seed").error(error);
      throw error;
    }
  }

  // Fetch user details from the database by ID and store it in the instance
  public async fetchUserById(contact: string): Promise<void> {
    try {
      const user = await userService.getUserByContact(contact);
      if (user) {
        this.user = user;
        Logger("fetchUserById").debug(
          `User with contact number ${contact} fetched successfully.`
        );
      } else {
        throw new Error(`User with contact number ${contact} not found.`);
      }
    } catch (error) {
      Logger("fetchUserById").error(error);
      throw error;
    }
  }

  // Fetch conversation details by user ID and store them in the instance
  public async fetchConversationsByUserId(userId: string): Promise<void> {
    try {
      const conversation = await conversationService.getConversationByUserId(
        userId
      );

      if (conversation) {
        this.conversation = conversation;
        Logger("fetchConversationsByUserId").debug(
          `Conversations for user with id ${userId} fetched successfully.`
        );
      } else {
        throw new Error(`Conversations for user with id ${userId} not found.`);
      }
    } catch (error) {
      Logger("fetchConversationsByUserId").error(error);
      throw error;
    }
  }

  // Get the stored user details
  public getUser(): IUser {
    return this.user as IUser;
  }

  // Get the stored conversations
  public getConversation(): IConversation {
    return this.conversation as IConversation;
  }
}
