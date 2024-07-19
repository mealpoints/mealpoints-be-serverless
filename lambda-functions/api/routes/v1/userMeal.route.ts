import { Router } from "express";
import { temporaryAuth } from "../../../../shared/middlewares/temporaryAuth.middleware";
import * as userMealController from "../../controllers/userMeal.controller";

const router = Router();

router.get("/user/:id", temporaryAuth, userMealController.getUserMealsByUserId);

export default router;
