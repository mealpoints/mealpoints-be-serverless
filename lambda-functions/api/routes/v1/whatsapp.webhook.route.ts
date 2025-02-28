import { Router } from "express";
import * as whatsappWebhookController from "../../controllers/whatsapp.webhook.controller";
import { restrictToAuthPhoneNumbers } from "../../middlewares/restrictToAuthPhoneNumber.middleware";

const router = Router();

router.post(
  "/",
  restrictToAuthPhoneNumbers,
  whatsappWebhookController.readMessage
);
router.get("/", whatsappWebhookController.verifyWebhook);

export default router;
