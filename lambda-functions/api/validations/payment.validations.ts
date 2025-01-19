import { z } from "zod";

export const validatePaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    paymentId: z.string(),
    signature: z.string(),
    recurringGroupId: z.string().optional(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    planId: z.string(),
    contact: z.string(),
  }),
});
