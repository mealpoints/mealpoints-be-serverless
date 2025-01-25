import { z } from "zod";

export const validatePaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    paymentId: z.string(),
    signature: z.string(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    planId: z.string(),
    contact: z.string(),
  }),
});
