const { responseHandler } = require("../../helpers/processHandle");
const asyncControllerHandler = require("../../helpers/asyncHandler");
const stripe = require("../../config/stripe");
const PaymentCards = require("../../models/PaymentCards");
const { isValidObjectId } = require("mongoose");
const { getDocID } = require("../../helpers/strings");
const TicketPayment = require("../../models/ticketPayment");
const Ticket = require("../../models/ticket");

// This assumes user object is attached to req (via token middleware)
const createPaymentIntent = asyncControllerHandler(async (req, res) => {
  const { amount, paymentMethod, ticketId } = req.body;
  const user = req.user;
  const userId = getDocID(user);

  // Validate inputs
  if (!amount || amount <= 0) {
    return responseHandler.error(res, "Valid amount is required.", 400);
  }

  if (!user?.stripeCustomerId) {
    return responseHandler.error(
      res,
      "Stripe customer ID not found for user.",
      400
    );
  }

  if (!isValidObjectId(paymentMethod)) {
    return responseHandler.error(
      res,
      "Valid payment method ID is required.",
      400
    );
  }

  if (!isValidObjectId(ticketId)) {
    return responseHandler.error(res, "Valid ticket ID is required.", 400);
  }

  // Find the ticket
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return responseHandler.error(res, "Ticket not found.", 404);
  }

  // Ensure ticket belongs to user
  if (getDocID(ticket.user).toString() !== userId.toString()) {
    return responseHandler.error(
      res,
      "This ticket doesn't belong to you.",
      403
    );
  }

  // Find payment card
  const paymentCard = await PaymentCards.findOne({
    _id: paymentMethod,
    user: userId,
  });

  if (!paymentCard) {
    return responseHandler.error(res, "Payment method not found.", 404);
  }

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to dollars to cents
    currency: "usd",
    customer: user.stripeCustomerId,
    payment_method: paymentCard.stripePaymentMethodId,
    confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    receipt_email: user.email,
    setup_future_usage: "off_session",
    description: `First payment for ticket #${ticket.ticketNumber}`,
    metadata: {
      ticket_id: ticketId,
      user_id: userId,
      payment_type: "one_time",
      installment_number: "1",
      // total_installments: String(ticket.installmentsCount || 1),
      ticket_number: ticket.ticketNumber,
    },
  });

  // Create a ticket payment record
  const ticketPayment = new TicketPayment({
    ticket: ticketId,
    sequence: 1,
    paymentMethod: getDocID(paymentCard),
    transactionId: paymentIntent.id,
    amount: Math.round(amount * 100),
    status: "Paid",
    autoChargeStatus: "Success",
    dueDate: new Date(),
    paidDate: new Date(),
  });
  await ticketPayment.save();

  // If this is a one-time payment, mark ticket as paid
  if (ticket.installmentsCount <= 1) {
    await Ticket.findByIdAndUpdate(ticketId, {
      isCompleted: true,
      isPaid: true,
      status: "closed",
    });
  }

  return responseHandler.success(res, {
    success: true,
    transaction_id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    requiresInstallments: ticket.installmentsCount > 1,
    status: paymentIntent.status,
    message: "Payment processed successfully.",
  });
});

const createSubscriptionWithInstallments = asyncControllerHandler(
  async (req, res) => {
    const {
      amount, // Total amount in dollars
      installmentCount, // Total number of installments
      billingPeriod, // "daily", "weekly", "biweekly", "monthly"
      paymentMethod, // { id: "card_id", type: "card" }
      ticketNumber, // Ticket number (for reference)
      ticketId, // ID of the ticket
      createFirstInstallment = true, // Flag to control if we process the first payment here
    } = req.body;

    const user = req.user;
    const userId = getDocID(user);

    // Basic validation
    if (!amount || amount <= 0) {
      return responseHandler.error(res, "Valid total amount is required.", 400);
    }

    if (!installmentCount || installmentCount < 1 || installmentCount > 8) {
      return responseHandler.error(
        res,
        "Installment count must be between 1 and 8.",
        400
      );
    }

    if (
      installmentCount > 1 &&
      !["daily", "weekly", "biweekly", "monthly"].includes(billingPeriod)
    ) {
      return responseHandler.error(res, "Invalid billing period.", 400);
    }

    if (!paymentMethod?.id || !paymentMethod?.type) {
      return responseHandler.error(
        res,
        "Valid payment method is required.",
        400
      );
    }

    if (!user?.stripeCustomerId) {
      return responseHandler.error(res, "Stripe customer ID not found.", 400);
    }

    if (!ticketId || !isValidObjectId(ticketId)) {
      return responseHandler.error(res, "Valid ticket ID is required.", 400);
    }

    // Verify ticket exists and belongs to the user
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return responseHandler.error(res, "Ticket not found.", 404);
    }

    if (getDocID(ticket.user).toString() !== userId.toString()) {
      return responseHandler.error(
        res,
        "This ticket doesn't belong to you.",
        403
      );
    }

    // Convert total amount to cents with 2 decimal precision
    const totalAmountInCents = Math.round(parseFloat(amount).toFixed(2) * 100);

    // For single payment, no need to calculate installments
    let firstInstallmentAmountInCents = totalAmountInCents;
    let installmentAmountInCents = totalAmountInCents;

    // Only calculate installment amounts if we have more than 1 installment
    if (installmentCount > 1) {
      // Calculate installment amount (floor to avoid fractional cents)
      installmentAmountInCents = Math.floor(
        totalAmountInCents / installmentCount
      );

      // Handle remainder in first payment
      firstInstallmentAmountInCents =
        totalAmountInCents - installmentAmountInCents * (installmentCount - 1);
    }

    // Retrieve payment card
    const paymentCard = await PaymentCards.findById(paymentMethod.id);
    if (!paymentCard) {
      return responseHandler.error(res, "Payment method not found.", 404);
    }

    if (!paymentCard.stripePaymentMethodId) {
      return responseHandler.error(
        res,
        "The provided card doesn't have Stripe integration.",
        400
      );
    }

    // let firstPaymentId = null;

    // Process first installment if requested
    // Create a payment intent for the first installment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: firstInstallmentAmountInCents,
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: paymentCard.stripePaymentMethodId,
      confirm: true,
      receipt_email: user.email,
      setup_future_usage: "off_session",
      description:
        installmentCount > 1
          ? `First installment for ticket #${ticketNumber}`
          : `Full payment for ticket #${ticketNumber}`,
      metadata: {
        ticket_id: ticketId,
        user_id: userId,
        payment_type: installmentCount > 1 ? "installment" : "one_time",
        installment_number: "1",
        total_installments: installmentCount.toString(),
        ticket_number: ticketNumber,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Create a ticket payment record for the first/only payment
    const ticketPayment = new TicketPayment({
      ticket: ticketId,
      sequence: 1,
      paymentMethod: getDocID(paymentCard),
      transactionId: paymentIntent.id,
      amount: (firstInstallmentAmountInCents / 100).toFixed(2),
      status: "Paid",
      autoChargeStatus: "Success",
      dueDate: new Date(),
      paidDate: new Date(),
    });
    await ticketPayment.save();

    firstPaymentId = paymentIntent.id;

    // If only one installment, mark ticket as paid and return
    if (installmentCount <= 1) {
      await Ticket.findByIdAndUpdate(ticketId, {
        isPaid: true,
        status: "closed",
        isCompleted: true,
      });

      return responseHandler.success(res, {
        success: true,
        payment: {
          transaction_id: firstPaymentId,
          amount: (firstInstallmentAmountInCents / 100).toFixed(2),
          amount_cents: firstInstallmentAmountInCents,
        },
        subscription: null,
        message: "Full payment processed successfully.",
      });
    }

    // If we reach here, we have more than 1 installment and need to create a subscription

    // Map billing period to Stripe interval settings
    let interval;
    let intervalCount;

    switch (billingPeriod) {
      case "daily":
        interval = "day";
        intervalCount = 1;
        break;
      case "weekly":
        interval = "week";
        intervalCount = 1;
        break;
      case "biweekly":
        interval = "week";
        intervalCount = 2;
        break;
      case "monthly":
      default:
        interval = "month";
        intervalCount = 1;
        break;
    }

    // Calculate remaining installments
    const remainingInstallments = installmentCount - 1;

    // Calculate due dates for the remaining installments
    const dueDates = [];
    const now = new Date();

    for (let i = 1; i <= remainingInstallments; i++) {
      let nextDate = new Date(now);

      if (interval === "day") {
        nextDate.setDate(nextDate.getDate() + intervalCount * i);
      } else if (interval === "week") {
        nextDate.setDate(nextDate.getDate() + 7 * intervalCount * i);
      } else if (interval === "month") {
        nextDate.setMonth(nextDate.getMonth() + intervalCount * i);
      }

      dueDates.push(nextDate);
    }

    // Create a product for this subscription
    const product = await stripe.products.create({
      name: `Installment Plan for Ticket #${ticketNumber}`,
      description: `${installmentCount} installments payment plan`,
      metadata: {
        user_id: userId,
        ticket_id: ticketId,
        ticket_number: ticketNumber,
      },
    });

    // Create a price with regular installment amount
    const price = await stripe.prices.create({
      unit_amount: installmentAmountInCents,
      currency: "usd",
      product: product.id,
      recurring: {
        interval: interval,
        interval_count: intervalCount,
      },
    });

    // Create a subscription for remaining installments
    // const subscriptionParams = {
    //   customer: user.stripeCustomerId,
    //   items: [{ price: price.id }],
    //   default_payment_method: paymentCard.stripePaymentMethodId,
    //   metadata: {
    //     user_id: userId,
    //     ticket_id: ticketId,
    //     total_installments: installmentCount.toString(),
    //     remaining_installments: (installmentCount - 1).toString(),
    //     billing_period: billingPeriod,
    //     ticket_number: ticketNumber,
    //     // first_payment_id: firstPaymentId,
    //   },
    //   // Cancel after the last installment is charged
    //   cancel_at:
    //     Math.floor(dueDates[dueDates.length - 1].getTime() / 1000) +
    //     24 * 60 * 60,
    // };
    // *******for if we create first istallment payment manualy above code ******
    const firstDueDate = dueDates[0];
    const firstDueTimestamp = Math.floor(firstDueDate.getTime() / 1000);

    // Create a subscription with correct parameters according to Stripe docs
    const subscriptionParams = {
      customer: user.stripeCustomerId,
      items: [{ price: price.id }],
      default_payment_method: paymentCard.stripePaymentMethodId,
      // Use trial_end to delay the first invoice
      trial_end: firstDueTimestamp,
      // Set to allow_incomplete to let Stripe handle payment failures
      payment_behavior: "default_incomplete",
      // Add the collection_method parameter to ensure auto-charging
      collection_method: "charge_automatically",
      metadata: {
        user_id: userId,
        ticket_id: ticketId,
        total_installments: installmentCount.toString(),
        remaining_installments: remainingInstallments.toString(),
        billing_period: billingPeriod,
        ticket_number: ticketNumber,
        first_payment_id: firstPaymentId,
      },
      // Cancel after the last installment is charged
      cancel_at:
        Math.floor(dueDates[dueDates.length - 1].getTime() / 1000) +
        24 * 60 * 60,
    };
    const subscription = await stripe.subscriptions.create(subscriptionParams);

    // Update ticket with subscription ID
    await Ticket.findByIdAndUpdate(ticketId, {
      stripeSubscriptionId: subscription.id,
    });

    // Create payment records for the remaining installments
    for (let i = 0; i < remainingInstallments; i++) {
      const sequence = i + 2; // Start at 2 because first payment is sequence 1

      const paymentData = {
        ticket: ticketId,
        sequence: sequence,
        paymentMethod: getDocID(paymentCard),
        amount: (installmentAmountInCents / 100).toFixed(2),
        status: "Pending",
        autoChargeStatus: "Success",
        dueDate: dueDates[i],
      };

      const payment = new TicketPayment(paymentData);
      await payment.save();
    }

    // Return response with subscription info
    return responseHandler.success(res, {
      success: true,
      firstPayment: createFirstInstallment
        ? {
            // transaction_id: firstPaymentId,
            amount: (firstInstallmentAmountInCents / 100).toFixed(2), // Convert back to dollars, 2 decimal precision
            amount_cents: firstInstallmentAmountInCents,
          }
        : null,
      subscription: {
        id: subscription.id,
        total_installments: installmentCount,
        remaining_installments: remainingInstallments,
        amount_per_installment: (installmentAmountInCents / 100).toFixed(2), // In dollars with 2 decimal precision
        amount_per_installment_cents: installmentAmountInCents,
        billing_period: billingPeriod,
        interval: interval,
        interval_count: intervalCount,
        next_payment_date: dueDates[0],
      },
      dueDates: dueDates.map((date) => date.toISOString()),
      message: createFirstInstallment
        ? "First payment successful and subscription created for remaining installments."
        : "Subscription created successfully for remaining installments.",
    });
  }
);

const changeSubscriptionPaymentMethod = asyncControllerHandler(
  async (req, res) => {
    const { ticketId, cardId } = req.body;
    const user = req.user;
    const userId = getDocID(user);

    // Validate inputs
    if (!isValidObjectId(ticketId)) {
      return responseHandler.error(res, "Valid ticket ID is required.", 400);
    }

    if (!isValidObjectId(cardId)) {
      return responseHandler.error(
        res,
        "Valid payment card ID is required.",
        400
      );
    }

    // Find the ticket
    const ticket = await Ticket.findOne({ _id: ticketId, user: userId });
    if (!ticket) {
      return responseHandler.error(res, "Ticket not found.", 404);
    }

    // Check if ticket has a subscription
    if (!ticket.stripeSubscriptionId) {
      return responseHandler.error(
        res,
        "This ticket doesn't have an active subscription.",
        400
      );
    }

    // Find payment card
    const paymentCard = await PaymentCards.findOne({
      _id: cardId,
      user: userId,
    });

    if (!paymentCard) {
      return responseHandler.error(res, "Payment method not found.", 404);
    }

    if (!paymentCard.stripePaymentMethodId) {
      return responseHandler.error(
        res,
        "The provided card doesn't have Stripe integration.",
        400
      );
    }

    // Update the subscription's default payment method in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      ticket.stripeSubscriptionId,
      {
        default_payment_method: paymentCard.stripePaymentMethodId,
      }
    );

    // Update all pending ticket payments with the new payment method
    await TicketPayment.updateMany(
      {
        ticket: ticketId,
        status: "Pending",
      },
      {
        paymentMethod: getDocID(paymentCard),
      }
    );

    ticket.paymentMethod.card = getDocID(paymentCard);
    await ticket.save();

    return responseHandler.success(res, {
      success: true,
      message: "Payment method updated successfully.",
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        current_period_end: new Date(
          updatedSubscription.current_period_end * 1000
        ),
        payment_method: paymentCard._id,
      },
    });
  }
);

module.exports = {
  createPaymentIntent,
  createSubscriptionWithInstallments,
  changeSubscriptionPaymentMethod,
};
