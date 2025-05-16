const express = require("express");
const router = express.Router();
const {
  uploadFiles,
  downloadFile,
  updateFile,
  deleteFile,
} = require("../../controllers/Files/files");
const { protectByCookie } = require("../../middlewares/protectApi");
const { isAdminORUser } = require("../../middlewares/validateRoles");

// Bulk file upload (allow multiple files)
router.post("/upload", protectByCookie, isAdminORUser, uploadFiles);

// File download route
router.get("/download/:fileName", protectByCookie, isAdminORUser, downloadFile);

// File update route
router.put("/update/:fileName", protectByCookie, isAdminORUser, updateFile);

// File delete route
router.delete("/delete/:fileName", protectByCookie, isAdminORUser, deleteFile);

module.exports = router;
