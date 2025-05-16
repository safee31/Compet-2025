const asyncControllerHandler = require("../../helpers/asyncHandler");
const stripe = require("../../config/stripe");
const TicketPayment = require("../../models/ticketPayment");
const Ticket = require("../../models/ticket");
const { isValidObjectId } = require("mongoose");
const { getDocID } = require("../../helpers/strings");
const { STRIPE_WEBHOOK_SECRET } = require("../../config");

const handleStripeWebhook = asyncControllerHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body, // Using req.body directly as configured in your system
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log(`Received webhook event: ${event.type}`);

  // Handle the event based on its type
  try {
    switch (event.type) {
      // For subscription payments
      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;

      // For direct payments (first installment or one-time payments)
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      // For subscription lifecycle
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return res.status(500).send(`Server Error: ${error.message}`);
  }
});

// Handle successful invoice payments - for subscription payments after the first one
async function handleInvoicePaid(invoice) {
  console.log(
    "Processing invoice.paid event for invoice:",
    invoice.id
  );

  try {
    // Skip if no subscription associated
    if (
      !invoice.subscription &&
      !invoice.parent?.subscription_details?.subscription
    ) {
      console.warn("No subscription found in invoice");
      return;
    }

    // Skip zero-amount invoices
    if (invoice.amount_paid === 0) {
      console.warn(`Zero amount invoice ${invoice.id}`);
      return;
    }

    // Get subscription metadata directly from invoice.parent
    const subscriptionMeta = invoice.parent?.subscription_details?.metadata;

    if (!subscriptionMeta?.ticket_id) {
      console.warn("No ticket_id in subscription metadata");
      return;
    }

    const ticketId = subscriptionMeta.ticket_id;

    // Retrieve the ticket to check its status
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      console.warn(`Ticket ${ticketId} not found`);
      return;
    }

    // Check if ticket is already closed or paid
    if (ticket.isPaid || ticket.status === "closed") {
      console.warn(
        `Ticket ${ticketId} is already closed or paid. Skipping payment processing.`
      );
      return;
    }

    // Get payment identification
    // let transactionId = invoice.payment_intent || invoice.charge || invoice.id;
    const amountInCents = invoice.amount_paid;

    // Find the next pending ticket payment by sequence
    const pendingPayment = await TicketPayment.findOne({
      ticket: ticketId,
      status: "Pending",
    }).sort({ sequence: 1 });

    if (pendingPayment) {
      // Convert pendingPayment.amount to cents for comparison (multiply by 100 if stored in dollars)
      const pendingAmountInCents = pendingPayment.amount * 100;

      // Check if amounts match (with small tolerance for rounding)
      if (Math.abs(pendingAmountInCents - amountInCents) > 1) {
        console.warn(
          `Amount mismatch. Invoice amount: ${amountInCents} cents, Expected payment amount: ${pendingAmountInCents} cents`
        );
        // Continue processing despite mismatch - you can choose to return here if preferred
      }

      pendingPayment.status = "Paid";
      // pendingPayment.transactionId = transactionId;
      pendingPayment.invoiceId = invoice.id;
      pendingPayment.paidDate = new Date();
      pendingPayment.paidAmount = amountInCents; // Store original amount in cents
      await pendingPayment.save();

      console.log(
        `Updated payment record ${pendingPayment._id} (sequence ${pendingPayment.sequence}) for ticket ${ticketId}`
      );

      // Check if this was the last payment
      const pendingCount = await TicketPayment.countDocuments({
        ticket: ticketId,
        status: "Pending",
      });

      // If no pending payments remain, mark the ticket as completed
      if (pendingCount === 0) {
        await Ticket.findByIdAndUpdate(ticketId, {
          isPaid: true,
          status: "closed",
          isCompleted: true,
        });

        console.log(
          `All installments paid for ticket ${ticketId}, marked as completed`
        );
      }
    } else {
      // No pending payment found - this could happen if webhook events come out of order
      console.warn(`No pending payment found for ticket ${ticketId}`);

      // Determine sequence based on existing payments
      const existingPaymentsCount = await TicketPayment.countDocuments({
        ticket: ticketId,
        status: "Paid",
      });

      // Create a new payment record
      const newPayment = new TicketPayment({
        ticket: ticketId,
        sequence: existingPaymentsCount + 1,
        paymentMethod: ticket.paymentMethod?.card || "unknown",
        amount: amountInCents / 100, // Store in dollars format in DB
        paidAmount: amountInCents, // Also store the original cents amount
        status: "Paid",
        autoChargeStatus: "Success",
        dueDate: new Date(),
        paidDate: new Date(),
        // transactionId: transactionId,
        invoiceId: invoice.id,
      });

      await newPayment.save();
      console.log(
        `Created new payment record for ticket ${ticketId}, sequence ${
          existingPaymentsCount + 1
        }`
      );

      // Check if all installments are now paid
      const totalInstallments =
        parseInt(subscriptionMeta.total_installments) ||
        ticket.installmentsCount ||
        1;

      if (existingPaymentsCount + 1 >= totalInstallments) {
        await Ticket.findByIdAndUpdate(ticketId, {
          isPaid: true,
          status: "closed",
          isCompleted: true,
        });

        console.log(
          `All ${totalInstallments} installments paid for ticket ${ticketId}`
        );
      }
    }
  } catch (error) {
    console.error("Error processing invoice.paid event:", error);
  }
}

// Handle failed invoice payments
async function handleInvoicePaymentFailed(invoice) {
  console.log(
    "Processing invoice.payment_failed event for invoice:",
    invoice.id
  );

  try {
    if (!invoice.subscription) {
      return;
    }

    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription
    );

    // Check for ticket_id in metadata
    if (!subscription.metadata.ticket_id) {
      return;
    }

    const ticketId = subscription.metadata.ticket_id;

    // Find ticket
    const ticket = await Ticket.findOne({
      $or: [{ _id: ticketId }, { stripeSubscriptionId: subscription.id }],
    });

    if (!ticket) {
      return;
    }

    // Get transaction ID if available
    const transactionId = invoice.payment_intent || invoice.charge;

    // Find the next pending payment
    const pendingPayment = await TicketPayment.findOne({
      ticket: ticketId,
      status: "Pending",
    }).sort({ sequence: 1 });

    if (pendingPayment) {
      // Update the payment record to failed
      await TicketPayment.findByIdAndUpdate(pendingPayment._id, {
        status: "Failed",
        autoChargeStatus: "Failed",
        invoiceId: invoice.id,
        transactionId: transactionId,
      });

      console.log(
        `Marked payment ${pendingPayment._id} as failed for ticket ${ticketId}`
      );
    } else {
      // No pending payment found - create a failed payment record
      const existingPaymentsCount = await TicketPayment.countDocuments({
        ticket: ticketId,
      });

      const newPayment = new TicketPayment({
        ticket: ticketId,
        sequence: existingPaymentsCount + 1,
        paymentMethod: ticket.paymentMethod.card,
        amount: invoice.amount_due,
        status: "Failed",
        autoChargeStatus: "Failed",
        dueDate: new Date(),
        transactionId: transactionId,
        invoiceId: invoice.id,
      });

      await newPayment.save();
      console.log(`Created new failed payment record for ticket ${ticketId}`);
    }
  } catch (error) {
    console.error("Error processing invoice.payment_failed event:", error);
  }
}

// Handle successful direct payments (including first installments)
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log(
    "Processing payment_intent.succeeded event:",
    paymentIntent,
    paymentIntent.metadata
  );

  try {
    // Skip if this is from an invoice (will be handled by invoice.paid)
    if (paymentIntent.invoice) {
      console.log(
        `Payment intent ${paymentIntent.id} is from invoice ${paymentIntent.invoice}, skipping`
      );
      return;
    }

    // Check for ticket_id in metadata - this is set in your controller
    if (!paymentIntent.metadata || !paymentIntent.metadata.ticket_id) {
      console.log(
        `No ticket_id in metadata for payment intent: ${paymentIntent.id}`
      );
      return;
    }

    const ticketId = paymentIntent.metadata.ticket_id;
    if (!isValidObjectId(ticketId)) {
      console.log(`Invalid ticket_id in metadata: ${ticketId}`);
      return;
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      console.log(`No ticket found with ID: ${ticketId}`);
      return;
    }

    // Get installment information from metadata - matches your controller
    const installmentNumber = parseInt(
      paymentIntent.metadata.installment_number || "1"
    );
    const paymentType = paymentIntent.metadata.payment_type || "one_time";
    const totalInstallments = parseInt(
      paymentIntent.metadata.total_installments || "1"
    );

    // Look for existing payment with this transaction ID or by sequence
    let payment = await TicketPayment.findOne({
      $or: [
        { ticket: ticketId, sequence: installmentNumber },
        { transactionId: paymentIntent.id },
      ],
    });

    if (payment) {
      // Update existing payment record
      await TicketPayment.findByIdAndUpdate(payment._id, {
        status: "Paid",
        transactionId: paymentIntent.id,
        paidDate: new Date(),
      });

      console.log(`Updated payment ${payment._id} for ticket ${ticketId}`);
    } else {
      // Create new payment record - this should rarely happen since you create it in the controller
      const newPayment = new TicketPayment({
        ticket: ticketId,
        sequence: installmentNumber,
        paymentMethod: ticket.paymentMethod.card,
        transactionId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: "Paid",
        autoChargeStatus: "Success",
        dueDate: new Date(),
        paidDate: new Date(),
      });

      await newPayment.save();
      console.log(
        `Created new payment record for ticket ${ticketId}, sequence ${installmentNumber}`
      );
    }

    // If this is a one-time payment or the total installments is 1, mark ticket as completed
    if (totalInstallments === 1 || paymentType === "one_time") {
      await Ticket.findByIdAndUpdate(ticketId, {
        isPaid: true,
        status: "closed",
        isCompleted: true,
      });

      console.log(`One-time payment completed for ticket ${ticketId}`);
    }
  } catch (error) {
    console.error("Error processing payment_intent.succeeded event:", error);
  }
}

// Handle failed payment intents
async function handlePaymentIntentFailed(paymentIntent) {
  console.log(
    "Processing payment_intent.payment_failed event:",
    paymentIntent.id
  );

  try {
    // Skip if this is from an invoice
    if (paymentIntent.invoice) {
      return;
    }

    // Check for ticket_id in metadata
    if (!paymentIntent.metadata || !paymentIntent.metadata.ticket_id) {
      return;
    }

    const ticketId = paymentIntent.metadata.ticket_id;
    if (!isValidObjectId(ticketId)) {
      return;
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return;
    }

    // Get installment information from metadata
    const installmentNumber = parseInt(
      paymentIntent.metadata.installment_number || "1"
    );

    // Find or create payment record
    let payment = await TicketPayment.findOne({
      $or: [
        { ticket: ticketId, sequence: installmentNumber },
        { transactionId: paymentIntent.id },
      ],
    });

    if (payment) {
      // Update payment status to failed
      await TicketPayment.findByIdAndUpdate(payment._id, {
        status: "Failed",
        autoChargeStatus: "Failed",
        transactionId: paymentIntent.id,
      });

      console.log(
        `Marked payment ${payment._id} as failed for ticket ${ticketId}`
      );
    } else {
      // Create failed payment record
      const newPayment = new TicketPayment({
        ticket: ticketId,
        sequence: installmentNumber,
        paymentMethod: ticket.paymentMethod.card,
        transactionId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: "Failed",
        autoChargeStatus: "Failed",
        dueDate: new Date(),
      });

      await newPayment.save();
      console.log(
        `Created failed payment record for ticket ${ticketId}, sequence ${installmentNumber}`
      );
    }
  } catch (error) {
    console.error(
      "Error processing payment_intent.payment_failed event:",
      error
    );
  }
}

// Handle subscription deletion or completion
async function handleSubscriptionDeleted(subscription) {
  console.log(
    "Processing customer.subscription.deleted event:",
    subscription.id
  );

  try {
    // Check for ticket_id in metadata
    if (!subscription.metadata || !subscription.metadata.ticket_id) {
      // Try finding ticket by subscription ID
      const ticket = await Ticket.findOne({
        stripeSubscriptionId: subscription.id,
      });
      if (!ticket) {
        return;
      }

      const ticketId = getDocID(ticket);
      handleSubscriptionDeletedForTicket(subscription, ticketId);
    } else {
      const ticketId = subscription.metadata.ticket_id;

      if (!isValidObjectId(ticketId)) {
        return;
      }

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return;
      }

      handleSubscriptionDeletedForTicket(subscription, ticketId);
    }
  } catch (error) {
    console.error("Error processing subscription.deleted event:", error);
  }
}

// Helper function to handle subscription deletion logic
async function handleSubscriptionDeletedForTicket(subscription, ticketId) {
  // Get total paid installments
  const paidCount = await TicketPayment.countDocuments({
    ticket: ticketId,
    status: "Paid",
  });

  // Get total expected installments from subscription metadata or ticket
  const ticket = await Ticket.findById(ticketId);
  const totalInstallments = parseInt(
    subscription.metadata.total_installments || ticket.installmentsCount || 1
  );

  // If all expected installments were paid, mark as complete
  if (paidCount >= totalInstallments) {
    await Ticket.findByIdAndUpdate(ticketId, {
      isPaid: true,
      status: "closed",
      isCompleted: true,
    });

    console.log(
      `All installments paid for ticket ${ticketId}, marked as completed`
    );
  } else {
    // Some installments weren't paid
    // Find all pending payments and mark them as failed
    await TicketPayment.updateMany(
      { ticket: ticketId, status: "Pending" },
      {
        status: "Failed",
        autoChargeStatus: "Failed",
      }
    );

    const updatedCount = await TicketPayment.countDocuments({
      ticket: ticketId,
      status: "Failed",
    });

    console.log(
      `Subscription ended with ${paidCount}/${totalInstallments} installments paid. Marked ${updatedCount} pending payments as failed.`
    );
  }
}

module.exports = {
  handleStripeWebhook,
};
