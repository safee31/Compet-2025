const User = require("../../models/user");
const { responseHandler } = require("../../helpers/processHandle");
const Role = require("../../models/role");
const asyncControllerHandler = require("../../helpers/asyncHandler");
const { isValidObjectId, default: mongoose } = require("mongoose");

// ✅ Get All Verified & Approved Users (Excluding Admins)
const getAllVerifiedUsers = asyncControllerHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    company,
    search,
    approval,
    // verification,
    isAll,
  } = req?.query;

  const isAllDocs = isAll === "true";
  const roles = await Role.find({ type: { $in: [2, 3] } }).distinct("_id");
  const query = { isDeleted: false, role: { $in: roles } };

  if (search?.trim()) {
    const userIds = await User.find({
      fullName: { $regex: search, $options: "i" },
    }).distinct("user");
    if (userIds?.length) {
      query.user = { $in: userIds };
    }
  }
  if (approval && ["true", "false"].includes(approval)) {
    query.isApproved = JSON.parse(approval);
  }
  // if (verification && ["true", "false"].includes(verification)) {
  const userIds = await User.find({
    isVerified: true,
  }).distinct("_id");

  // if (userIds?.length) {
  //   query.user = { $in: userIds };
  // }
  // }
  let queryPipeline = [{ $match: query }];
  if (!isAllDocs) {
    const offset = (parseInt(page) - 1) * limit;
    queryPipeline.push({ $skip: offset });
    queryPipeline.push({ $limit: parseInt(limit) });
  }
  const users = await User.aggregate([
    { $match: { user: { $in: userIds } } },
    ...queryPipeline,
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },

    {
      $project: {
        _id: 1,
        role: { $ifNull: [{ $arrayElemAt: ["$role", 0] }, null] },
        isVerified: 1,
        isActive: 1,
        isApproved: 1,
        createdAt: 1,
      },
    },
  ]).allowDiskUse(true);

  const totalDocs = await User.countDocuments(query);
  const totalPages = Math.ceil(totalDocs / limit);

  responseHandler.success(
    res,
    {
      totalDocs,
      users,
      totalPages,
      currentPage: parseInt(page),
      hasPrevPage: parseInt(page) > 1,
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
    },
    "Users fetched successfully"
  );
});
module.exports = { getAllVerifiedUsers };
