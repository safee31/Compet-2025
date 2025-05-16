const express = require("express");
const { protectByCookie } = require("../../middlewares/protectApi");
const { isAdmin } = require("../../middlewares/validateRoles");
const { getAllVerifiedUsers } = require("../../controllers/Admin/admin");
const router = express.Router();

router.get("/users/verified", protectByCookie, isAdmin, getAllVerifiedUsers);
module.exports = router;
