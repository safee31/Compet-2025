const { responseHandler } = require("../../helpers/processHandle");
const asyncControllerHandler = require("../../helpers/asyncHandler");
const TicketPayment = require("../../models/ticketPayment");
const { isValidObjectId } = require("mongoose");
const Ticket = require("../../models/ticket");
const { getDocID } = require("../../helpers/strings");

const createTicketPayment = asyncControllerHandler(async (req, res) => {
  const { ticketId, dueDates, paymentMethod, transactionId, amountPerCharge } =
    req.body;

  if (!Array.isArray(dueDates) || !dueDates?.length) {
    return responseHandler.error(
      res,
      "Please provide valid due dates. Example: ['2025-06-01', '2025-06-08']",
      400
    );
  }

  const dueDatesArray = [...dueDates];

  // Loop through each due date and create a payment record
  for (let i = 0; i < dueDatesArray.length; i++) {
    const paymentData = {
      ticketId,
      dueDate: dueDatesArray[i],
      sequence: i + 1,
      status:
        i === 0
          ? paymentMethod === "Stripe"
            ? "Confirmed"
            : "Paid"
          : "Pending",
      transactionId: i === 0 ? transactionId : null,
      amount: amountPerCharge,
      paymentMethod: i === 0 ? paymentMethod : null,
      paidDate: i === 0 && paymentMethod === "Stripe" ? new Date() : null,
    };

    const payment = new TicketPayment(paymentData);
    await payment.save();
  }

  return responseHandler.success(
    res,
    { success: true },
    "Payment installments created successfully"
  );
});

const getUserPayments = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);
  const {
    page = 1,
    limit = 10,
    isAll = false,
    status = "",
    startDate,
    endDate,
  } = req.query;

  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid User ID", 400);
  }
  if (
    status?.trim() &&
    !["Paid", "Failed", "Pending"].includes(status?.trim())
  ) {
    return responseHandler.error(res, "Invalid Status value.", 400);
  }

  // Step 1: Get ticket IDs for the user
  const ticketIds = await Ticket.distinct("_id", { user: userId });

  if (!ticketIds.length) {
    return responseHandler.success(
      res,
      {
        payments: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: parseInt(page),
      },
      "No payments found for this user"
    );
  }

  // Step 2: Build aggregation pipeline
  const matchStage = {
    $match: { ticket: { $in: ticketIds }, ...(status ? { status } : {}) },
  };
  if (startDate && endDate) {
    matchStage.$match = {
      ...matchStage.$match,
      dueDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  }
  const sortStage = { $sort: { paidDate: -1 } };
  const lookupStage = {
    $lookup: {
      from: "tickets",
      localField: "ticket",
      foreignField: "_id",
      as: "ticket",
      pipeline: [{ $project: { ticketNumber: 1 } }],
    },
  };
  const unwindStage = { $unwind: "$ticket" };
  const projectStage = {
    $project: {
      _id: 1,
      ticket: "$ticket",
      dueDate: 1,
      amount: 1,
      status: 1,
      paidDate: 1,
      paymentMethod: 1,
      sequence: 1,
      transactionId: 1,
      createdAt: 1,
    },
  };

  const aggregationPipeline = [matchStage, sortStage];

  if (!isAll) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    aggregationPipeline.push({ $skip: skip }, { $limit: parseInt(limit) });
  }

  aggregationPipeline.push(lookupStage, unwindStage, projectStage);

  // Step 4: Fetch documents and count
  const payments = await TicketPayment.aggregate(aggregationPipeline);
  const totalCount = await TicketPayment.countDocuments({
    ticket: { $in: ticketIds },
    status,
  });

  return responseHandler.success(
    res,
    {
      payments,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
    },
    "Payments fetched successfully"
  );
});

const getPaymentSummary = asyncControllerHandler(async (req, res) => {
  const userId = getDocID(req.user);

  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid User ID", 400);
  }

  // Step 1: Get ticket IDs for the user
  const ticketIds = await Ticket.distinct("_id", { user: userId });

  if (!ticketIds.length) {
    return responseHandler.success(
      res,
      {
        totalPaymentDue: 0,
        dueNext30Days: 0,
      },
      "No payments found for this user"
    );
  }

  // Get the current date and date 30 days from now
  const currentDate = new Date();
  const next30Days = new Date();
  next30Days.setDate(currentDate.getDate() + 30);

  // Step 2: Build aggregation pipeline for total pending payments
  const totalPendingPipeline = [
    {
      $match: {
        ticket: { $in: ticketIds },
        status: "Pending",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: { $toDouble: "$amount" } },
      },
    },
  ];

  // Step 3: Build aggregation pipeline for payments due in next 30 days
  const next30DaysPipeline = [
    {
      $match: {
        ticket: { $in: ticketIds },
        status: "Pending",
        dueDate: {
          $gte: currentDate,
          $lte: next30Days,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: { $toDouble: "$amount" } },
      },
    },
  ];

  // Step 4: Execute both aggregations
  const [totalPendingResult, next30DaysResult] = await Promise.all([
    TicketPayment.aggregate(totalPendingPipeline),
    TicketPayment.aggregate(next30DaysPipeline),
  ]);

  // Extract the total amounts, defaulting to 0 if no results
  const totalPaymentDue =
    totalPendingResult.length > 0
      ? Number(totalPendingResult[0].totalAmount.toFixed(2))
      : 0;

  const dueNext30Days =
    next30DaysResult.length > 0
      ? Number(next30DaysResult[0].totalAmount.toFixed(2))
      : 0;

  return responseHandler.success(
    res,
    {
      totalPaymentDue,
      dueNext30Days,
    },
    "Payment summary fetched successfully"
  );
});

module.exports = {
  createTicketPayment,
  getUserPayments,
  getPaymentSummary,
};
