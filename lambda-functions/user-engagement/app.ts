import { connectToDatabase, closeDBconnection } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { processUserEngagement } from './lib/index';
const Logger = logger("handler");

export const handler = async () => {
    Logger("UserEngagement").info("Starting user engagement");

    try {
        await connectToDatabase();

        await processUserEngagement();

        Logger("UserEngagement").info("Finished user engagement");
        // closing db connection to stop the function after successful execution
        await closeDBconnection();
        return;
    } catch (error) {
        Logger("UserEngagement").error("Error processing user engagement", error);
        throw error;
    }
};