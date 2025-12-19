"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const config_1 = __importDefault(require("../../../config"));
const stripe_1 = require("../../../helpers/stripe");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const payment_service_1 = require("./payment.service");
const handleStripeWebhookEvent = (0, catchAsync_1.default)(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = config_1.default.stripeWebhookSecret;
    if (!webhookSecret) {
        console.error("⚠️ Stripe webhook secret not configured");
        return res.status(500).send("Webhook secret not configured");
    }
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        const result = await payment_service_1.PaymentService.handleStripeWebhookEvent(event);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Webhook processed successfully',
            data: result,
        });
    }
    catch (error) {
        console.error("❌ Error processing webhook:", error);
        // Still return 200 to acknowledge receipt to Stripe
        // Stripe will retry if we return an error
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Webhook received but processing failed',
            data: { error: error.message },
        });
    }
});
exports.PaymentController = {
    handleStripeWebhookEvent
};
