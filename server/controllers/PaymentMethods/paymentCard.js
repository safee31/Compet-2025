const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { responseHandler } = require("../../helpers/processHandle");
const asyncControllerHandler = require("../../helpers/asyncHandler");
const { getDocID } = require("../../helpers/strings");
const { isValidObjectId } = require("mongoose");
const PaymentCards = require("../../models/PaymentCards");
const User = require("../../models/user");

// CREATE: Add a new payment card using Stripe PaymentMethod ID
const addPaymentCard = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);
  const email = req?.user?.email;
  const name = req?.user?.fullName;

  const { paymentMethodId, isDefault = false } = req.body;

  if (!isValidObjectId(userId) || !paymentMethodId || !email || !name) {
    return responseHandler.error(res, "Missing or invalid fields", 400);
  }

  // Create or get Stripe customer
  const customerList = await stripe.customers.search({
    query: `email:\'${email}\'`,
    limit: 1,
  });

  let customer = customerList.data[0];

  if (!customer) {
    customer = await stripe.customers.create({ email, name });
  }
  await User.findByIdAndUpdate(userId, { stripeCustomerId: customer.id });

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customer.id,
  });

  // Set default payment method if requested
  if (isDefault) {
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  // Get payment method details
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  const card = paymentMethod.card;

  // Remove existing default card for user
  if (isDefault) {
    await PaymentCards.updateMany({ user: userId }, { isDefault: false });
  }
  const existingCard = await PaymentCards.findOne({
    user: userId,
    fingerprint: card.fingerprint,
  });

  if (existingCard) {
    return responseHandler.error(res, "Card already exists", 409);
  }
  // Save card to DB
  const newCard = new PaymentCards({
    user: userId,
    stripePaymentMethodId: paymentMethodId,
    last4: card.last4,
    brand: card.brand,
    isDefault,
    exp_month: card.exp_month,
    exp_year: card.exp_year,
    fingerprint: card.fingerprint,
    country: card.country || "US",
    expiresAt: new Date(`${card.exp_year}-${card.exp_month}-01`),
  });

  await newCard.save();

  return responseHandler.success(
    res,
    { id: newCard._id },
    "Card added successfully"
  );
});

// READ: Get all payment cards for a user
const getUserCards = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);
  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid user ID", 400);
  }

  const cards = await PaymentCards.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return responseHandler.success(res, { cards }, "Cards fetched successfully");
});

// UPDATE: Set a new default card
// UPDATE: Set a new default card
const updateDefaultCard = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);
  const { paymentCardId } = req.body;

  if (!isValidObjectId(userId) || !isValidObjectId(paymentCardId)) {
    return responseHandler.error(res, "Invalid user or card ID", 400);
  }

  // Find the card in the database
  const cardToUpdate = await PaymentCards.findById(paymentCardId).populate(
    "user",
    "email"
  );
  if (!cardToUpdate) {
    return responseHandler.error(res, "Card not found", 404);
  }

  // Set the new default payment method in Stripe
  const paymentMethodId = cardToUpdate.stripePaymentMethodId;

  // Update the default payment method in Stripe first
  const customers = await stripe.customers.list({
    email: cardToUpdate.user?.email,
    limit: 1,
  });

  const customer = customers.data[0];

  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  // Remove the default flag from all cards in the database
  await PaymentCards.updateMany({ user: userId }, { isDefault: false });

  // Now update the default card in the database
  cardToUpdate.isDefault = true;
  await cardToUpdate.save();

  return responseHandler.success(
    res,
    cardToUpdate,
    "Default card updated successfully"
  );
});

// DELETE: Remove a payment card
const deletePaymentCard = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);
  const { paymentCardId } = req.params;

  if (!isValidObjectId(userId) || !isValidObjectId(paymentCardId)) {
    return responseHandler.error(res, "Invalid user or card ID", 400);
  }

  // Find the card to delete
  const card = await PaymentCards.findById(paymentCardId);
  if (!card) {
    return responseHandler.error(res, "Card not found", 404);
  }

  // Detach the payment method from Stripe
  await stripe.paymentMethods.detach(card.stripePaymentMethodId);

  // Remove the card from DB
  await card.remove();

  return responseHandler.success(res, {}, "Card removed successfully");
});

module.exports = {
  addPaymentCard,
  getUserCards,
  updateDefaultCard,
  deletePaymentCard,
};
