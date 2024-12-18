import { Router } from "express";
import * as razorpayWebhookController from "../../controllers/razorpay.webhook.controller";

const router = Router();

router.post("/", razorpayWebhookController.readData);

export default router;
