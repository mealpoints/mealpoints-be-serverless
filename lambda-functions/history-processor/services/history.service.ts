import logger from '../../../shared/config/logger';
import { IRecievedMessage } from '../../../shared/models/recievedMessage.model';
import { IUser } from '../../../shared/models/user.model';
import { findRecievedMessage, getMessagesInIntervalPerUser } from '../../../shared/services/message.service';
import { getUsersByLastSummarySentAt } from '../../../shared/services/user.service';

const Logger = logger("historyProcessor.service");

export class HistoryService {
    private usersToSendSummary: Array<{ user: IUser; messages: IRecievedMessage[] }> = [];
    private usersToSendReminder: Array<{ user: IUser; messages: IRecievedMessage[] }> = [];

    constructor() { }

    async processHistory() {
        Logger("processHistory").info("Starting history processor");
        try {
            const users = await this.getUsersToProcess();

            for (const user of users) {
                await this.processUser(user);
            }

            // Logic to push user messages into SQS
            // await this.pushToQueue();
        } catch (error) {
            Logger("processHistory").error("Error in processHistory", error);
            throw error;
        }
    }

    private async getUsersToProcess() {
        const SUMMARY_INTERVAL = 72;
        Logger("processUser").info(`Fetching users with lastSummarySentAt before ${SUMMARY_INTERVAL} hours ago`);
        const users = await getUsersByLastSummarySentAt(SUMMARY_INTERVAL);
        Logger("processUser").info(`Found ${users.length} users with lastSummarySentAt before ${SUMMARY_INTERVAL} hours ago`);
        return users;
    }

    private async processUser(user: IUser) {
        const summaryInterval = user.summaryInterval ?? 72;

        const messages = await getMessagesInIntervalPerUser(user._id, summaryInterval);
        if (messages.length > 0) {
            this.usersToSendSummary.push({
                user,
                messages
            });
        } else if ((user.remainingSummaries ?? 0) > 0) {
            const allMessages = await findRecievedMessage({ user: user._id });
            this.usersToSendReminder.push({
                user,
                messages: allMessages,
            });
        }

    }
}