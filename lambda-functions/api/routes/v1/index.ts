import { Router } from "express";

import conversation from "./conversation.route";
import userMeals from "./userMeal.route";
import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/whatsapp-webhook", whatsappWebhook);
router.use("/conversation", conversation);
router.use("/user-meal", userMeals);

export default router;
