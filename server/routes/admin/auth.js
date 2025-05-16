const express = require("express");
const { loginAdmin, logoutAdmin } = require("../../controllers/admin/auth");
const { protectByCookie } = require("../../middlewares/protectApi");
const { isAdmin } = require("../../middlewares/validateRoles");
const router = express.Router();

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", protectByCookie, isAdmin, logoutAdmin);


module.exports = router;