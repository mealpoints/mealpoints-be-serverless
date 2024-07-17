import { Router } from "express";
import { temporaryAuth } from "../../../../shared/middlewares/temporaryAuth.middleware";
import * as conversationController from "../../controllers/conversation.controller";

const router = Router();

router.get("/:id", temporaryAuth, conversationController.getConversation);

router.get(
  "/:id/messages",
  temporaryAuth,
  conversationController.getConversationMessages
);

export default router;
