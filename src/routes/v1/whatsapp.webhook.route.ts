import { Router } from "express";
import * as whatsappWebhookController from "../../controllers/whatsapp.webhook.controller";

const router = Router();

router.post("/", whatsappWebhookController.readMessage);

export default router;
