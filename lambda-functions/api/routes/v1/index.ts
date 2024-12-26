import { Router } from "express";

import bff from "./bff.route";
import report from "./mealReport.route";
import payment from "./payment.route";
import razorpayWebhook from "./razorpay.webhook.route";
import userMeals from "./userMeal.route";
import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/whatsapp-webhook", whatsappWebhook);
router.use("/razorpay-webhook", razorpayWebhook);
router.use("/meal-report", report);
router.use("/user-meal", userMeals);
router.use("/payment", payment);
router.use("/bff", bff);

export default router;
