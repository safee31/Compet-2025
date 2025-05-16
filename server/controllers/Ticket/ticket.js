const { responseHandler } = require("../../helpers/processHandle");
const asyncControllerHandler = require("../../helpers/asyncHandler");
const Ticket = require("../../models/ticket");
const TicketPayment = require("../../models/ticketPayment");
const { getDocID } = require("../../helpers/strings");
const { isValidObjectId } = require("mongoose");
const { uploadImagesToServer } = require("../../services/serverStorage/images");

const createTicket = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req?.user);
  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid User ID", 400);
  }
  const {
    ticketNumber,
    ticketType,
    location,
    policeAgency,
    dateTime,
    price,
    interest,
    amountWithInterest,
    installmentsCount,
    installmentsLabel,
    billingPeriod,
    isPaid,
    status,
    card = null,
    bank = null,
    // dueDates,
    // transactionId,
    // amountPerCharge,
  } = req.body;
  // if (!Array.isArray(dueDates) || !dueDates?.length) {
  //   return responseHandler.error(
  //     res,
  //     "Please provide valid due dates. Example: ['2025-06-01', '2025-06-08']",
  //     400
  //   );
  // }
  if (!isValidObjectId(card)) {
    return responseHandler.error(res, "Valid payment method is required.", 400);
  }

  const ticketPhoto = req.file;
  let photoURL = "";

  if (ticketPhoto) {
    const uploadedImages = await uploadImagesToServer({
      files: [ticketPhoto],
      folder: "ticket_photos",
    });

    const uploadedImage = uploadedImages[0];
    photoURL = uploadedImage?.filePath || "";
  }

  // Insert the ticket
  const ticket = new Ticket({
    user: userId,
    ticketNumber,
    ticketType,
    location,
    policeAgency,
    dateTime,
    price,
    ticketPhoto: photoURL,
    interest,
    amountWithInterest,
    installmentsCount,
    installmentsLabel,
    billingPeriod,
    isPaid: isPaid || false,
    status: status || "open",
    paymentMethod: { card, bank },
  });

  await ticket.save();

  // // Create Ticket Payment installments
  // for (let i = 0; i < dueDates.length; i++) {
  //   const paymentData = {
  //     ticket: newTicket._id,
  //     dueDate: dueDates[i],
  //     sequence: i + 1,
  //     status:
  //       i === 0
  //         ? paymentMethod === "Stripe"
  //           ? "Confirmed"
  //           : "Paid"
  //         : "Pending",
  //     transactionId: i === 0 ? transactionId : null,
  //     amount: amountPerCharge,
  //     paymentMethod: i === 0 ? paymentMethod : null,
  //     paidDate: i === 0 && paymentMethod === "Stripe" ? new Date() : null,
  //   };

  //   const payment = new TicketPayment(paymentData);
  //   await payment.save();
  // }

  return responseHandler.success(
    res,
    { ticket },
    "Ticket and payments created successfully"
  );
});

// Get tickets for a user with pagination or all tickets
const getUserTickets = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);
  const { page = 1, limit = 10, isAll = false } = req.query; // Default to page 1 and limit 10

  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid User ID", 400);
  }

  // Aggregation pipeline
  let aggregationPipeline = [
    { $match: { user: userId } }, // Match tickets for the user
    { $sort: { createdAt: -1 } }, // Sort tickets by creation date, descending
  ];

  // If pagination is enabled (isAll flag is false)
  if (!isAll) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pagination = [{ $skip: skip }, { $limit: parseInt(limit) }];
    aggregationPipeline = [...aggregationPipeline, ...pagination];
  }

  // Perform the aggregation query
  const tickets = await Ticket.aggregate(aggregationPipeline);

  // Get total count of tickets (for pagination)
  const totalCount = await Ticket.countDocuments({ user: userId });

  return responseHandler.success(
    res,
    {
      tickets,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
    },
    "Tickets fetched successfully"
  );
});

module.exports = {
  createTicket,
  getUserTickets,
};
