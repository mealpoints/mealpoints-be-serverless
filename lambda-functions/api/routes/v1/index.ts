import { Router } from "express";

import conversation from "./conversation.route";
import setting from "./setting.route";
import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/whatsapp-webhook", whatsappWebhook);
router.use("/conversation", conversation);
router.use("/setting", setting);

export default router;
