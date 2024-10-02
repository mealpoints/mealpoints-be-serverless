import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { HistoryService } from "./services/history.service";
const Logger = logger("handler");

export const handler = async () => {
    Logger("HistoryProcessor").info("Starting history processor");

    try {
        await connectToDatabase();

        const historyService = new HistoryService();
        await historyService.processHistory();

        Logger("HistoryProcessor").info("Finished history processor");
        return;
    } catch (error) {
        Logger("HistoryProcessor").error("Error processing history", error);
        throw error;
    }
}
