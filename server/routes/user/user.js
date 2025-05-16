const express = require("express");
const { protectByCookie } = require("../../middlewares/protectApi");
const { isAdminORUser } = require("../../middlewares/validateRoles");
const { uploadImage, uploadVideo } = require("../../middlewares/multer");

const {
  updateUser,
  updateUserProfileImage,
  updateUserIntroVideo,
} = require("../../controllers/User/user");

const router = express.Router();

router.patch(
  "/:userId",
  protectByCookie,
  isAdminORUser,
  uploadImage,
  updateUser
);
router.patch(
  "/profile-image/:userId",
  protectByCookie,
  isAdminORUser,
  uploadImage,
  updateUserProfileImage
);
router.patch(
  "/intro-video/:userId",
  protectByCookie,
  isAdminORUser,
  uploadVideo,
  updateUserIntroVideo
);

module.exports = router;
