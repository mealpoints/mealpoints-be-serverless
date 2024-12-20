import { Router } from "express";
import * as paymentController from "../../controllers/payment.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createOrderSchema,
  validatePaymentSchema,
} from "../../validations/payment.validations";
const router = Router();

router.post(
  "/order",
  validate(createOrderSchema),
  paymentController.createOrder
);
router.post(
  "/validate",
  validate(validatePaymentSchema),
  paymentController.validatePayment
);

export default router;
