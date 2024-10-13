import { Router } from "express";

import report from "./report.route";
import userMeals from "./userMeal.route";
import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/whatsapp-webhook", whatsappWebhook);
router.use("/report", report);
router.use("/user-meal", userMeals);

export default router;
