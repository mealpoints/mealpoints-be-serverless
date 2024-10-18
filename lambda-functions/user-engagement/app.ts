import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { processUserEngagement } from './lib/index';
const Logger = logger("handler");

export const handler = async () => {
    Logger("UserEngagement").info("Starting user engagement");

    try {
        await connectToDatabase();

        await processUserEngagement();

        Logger("UserEngagement").info("Finished user engagement");
        return;
    } catch (error) {
        Logger("UserEngagement").error("Error processing user engagement", error);
        throw error;
    }
};