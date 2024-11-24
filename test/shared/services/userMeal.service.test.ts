import logger from "../../../shared/config/logger";
import * as userMealService from "../../../shared/services/userMeal.service";
import { USER } from "../../mocks/user.mock";
const Logger = logger("userMeal.service.test");

describe("UserMealService", () => {
    it("getTodaysUserMealsByUserId", async () => {
        Logger("getTodaysUserMealsByUserId").info("");
        const userMeals = await userMealService.getTodaysUserMealsByUserId(USER.id);
        expect(userMeals.length).toBeDefined();
    });
});