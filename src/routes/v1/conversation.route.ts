import { Router } from "express";
import * as conversationController from "../../controllers/conversation.controller";

const router = Router();

router.get("/:id", conversationController.getConversation);
router.get("/:id/messages", conversationController.getConversationMessages);

export default router;
