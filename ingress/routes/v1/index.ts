import { Router } from "express";

import conversation from "./conversation.route";
import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/whatsapp-webhook", whatsappWebhook);
router.use("/conversation", conversation);

export default router;
