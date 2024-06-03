import { Router } from "express";

import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/whatsapp-webhook", whatsappWebhook);

export default router;
