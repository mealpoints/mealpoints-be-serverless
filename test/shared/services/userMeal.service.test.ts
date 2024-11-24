import logger from "../../../shared/config/logger";
import * as userMealService from "../../../shared/services/userMeal.service";
import { DataService } from "../../test_utils/DataService";
const Logger = logger("userMeal.service.test");

describe("UserMealService", () => {
    it("getTodaysUserMealsByUserId", async () => {
        Logger("getTodaysUserMealsByUserId").info("");
        const user = DataService.getInstance().getUser();
        const userMeals = await userMealService.getTodaysUserMealsByUserId(user.id);
        expect(userMeals.length).toBeDefined();
    });
});