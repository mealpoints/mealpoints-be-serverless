import { Router } from "express";

import books from "./books.route";
import whatsappWebhook from "./whatsapp.webhook.route";

const router = Router();

router.use("/books", books);
router.use("/whatsapp-webhook", whatsappWebhook);

export default router;
