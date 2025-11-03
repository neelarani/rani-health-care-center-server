import { catchAsync, sendResponse, stripe } from "@/shared";
import * as service from "./payment.service";
import config from "@/config";

export const handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.web_hook_secret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const result = await service.handleStripeWebhookEvent(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook req send successfully",
    data: result,
  });
});
