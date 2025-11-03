import { Router, raw } from "express";
import * as controller from "./payment.controller";

const router = Router();

router.post(
  "/webhook",
  raw({ type: "application/json" }),
  controller.handleStripeWebhookEvent
);

export default router;
