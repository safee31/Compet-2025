const { responseHandler } = require("../../helpers/processHandle");
const User = require("../../models/user");
const asyncControllerHandler = require("../../helpers/asyncHandler");
const { isValidObjectId } = require("mongoose");
const { uploadImagesToServer } = require("../../services/serverStorage/images");
const {
  deleteFileFromServer,
} = require("../../services/serverStorage/fileStoreage");
const { uploadVideosToServer } = require("../../services/serverStorage/videos");

const updateUser = asyncControllerHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid user ID", 400);
  }
  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return responseHandler.error(res, "User not found", 404);
  }

  if (updates.phone) user.phone = updates.phone;
  if (updates.fullName) user.fullName = updates.fullName;

  // Update driverLicense if present
  if (updates.driverLicense) {
    const driverLicensePhoto = req.file;
    if (driverLicensePhoto) {
      const uploadedImages = await uploadImagesToServer({
        files: [driverLicensePhoto],
        folder: "driver_licences",
      });

      const uploadedImage = uploadedImages[0];
      const imageUrl = uploadedImage?.filePath || "";

      if (user.driverLicense.photo && imageUrl) {
        const previousImageKey = user.driverLicense.photo.split("/").pop();

        // Delete the previous image using its Server Storage key
        await deleteFileFromServer({
          fileName: previousImageKey,
          folder: "driver_licences",
        });
      }

      updates.driverLicense.photo = imageUrl;
    }
    user.driverLicense = { ...user.driverLicense, ...updates.driverLicense };
  }

  if (user.isModified()) await user.save();
  return responseHandler.success(
    res,
    {
      user: user.toJSON(),
    },
    "User details updated successfully"
  );
});
const updateUserProfileImage = asyncControllerHandler(async (req, res) => {
  const { userId } = req.params;
  const profileImage = req.file;
  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid user ID", 400);
  }
  // Find the user
  const userExists = await User.findById(userId);
  if (!userExists) {
    return responseHandler.error(res, "User not found", 404);
  }

  if (profileImage) {
    const uploadedImages = await uploadImagesToServer({
      files: [profileImage],
      folder: "profile_photos",
    });

    const uploadedImage = uploadedImages[0];
    const imageUrl = uploadedImage?.filePath || "";

    if (userExists.profileImage && imageUrl) {
      const previousImageKey = userExists.profileImage.split("/").pop();

      // Delete the previous image using its Server Storage key
      await deleteFileFromServer({
        fileName: previousImageKey,
        folder: "profile_photos",
      });
    }

    userExists.profileImage = imageUrl;
    await userExists.save();

    // Return the updated profile image URL
    return responseHandler.success(
      res,
      { updatedProfileImage: userExists.profileImage },
      "Profile image updated successfully"
    );
  } else {
    if (userExists.profileImage) {
      const previousImageKey = userExists.profileImage.split("/").pop();

      // Delete the previous image using its Server Storage key
      await deleteFileFromServer({
        fileName: previousImageKey,
        folder: "profile_photos",
      });
    }

    userExists.profileImage = "";
    await userExists.save();

    return responseHandler.success(
      res,
      { updatedProfileImage: userExists.profileImage },
      "Profile image removed successfully"
    );
  }
});
const updateUserIntroVideo = asyncControllerHandler(async (req, res) => {
  const { userId } = req.params;
  const introVideo = req.file;
  if (!isValidObjectId(userId)) {
    return responseHandler.error(res, "Invalid user ID", 400);
  }
  // Find the user
  const userExists = await User.findById(userId);
  if (!userExists) {
    return responseHandler.error(res, "User not found", 404);
  }

  if (introVideo) {
    const uploadedIntroVideos = await uploadVideosToServer({
      files: [introVideo],
      folder: "intro_videos",
    });

    const uploadedImage = uploadedIntroVideos[0];
    const videoUrl = uploadedImage?.filePath || "";

    if (userExists.introVideo && videoUrl) {
      const previousImageKey = userExists.introVideo.split("/").pop();

      // Delete the previous video using its Server Storage key
      await deleteFileFromServer({
        fileName: previousImageKey,
        folder: "intro_videos",
      });
    }

    userExists.introVideo = videoUrl;
    await userExists.save();

    // Return the updated profile video URL
    return responseHandler.success(
      res,
      { updatedIntroVideo: userExists.introVideo },
      "Introduction video updated successfully"
    );
  } else {
    if (userExists.introVideo) {
      const previousImageKey = userExists.introVideo.split("/").pop();

      // Delete the previous video using its Server Storage key
      await deleteFileFromServer({
        fileName: previousImageKey,
        folder: "intro_videos",
      });
    }

    userExists.introVideo = "";
    await userExists.save();

    return responseHandler.success(
      res,
      { updatedIntroVideo: userExists.introVideo },
      "Introduction video removed successfully"
    );
  }
});

module.exports = {
  updateUser,
  updateUserProfileImage,
  updateUserIntroVideo,
};
