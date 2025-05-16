const multer = require("multer");

// Upload Middleware for Book Images
const uploadImage = multer({
  dest: "uploads/images/",
}).single("imageFile");

const uploadVideo = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit 50MB per video
}).single("videoFile");

const uploadImagesOrDocuments = multer({
  dest: "uploads/files/",
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",

      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPEG/PNG/JPG/WEBP images and PDF/DOC/DOCX documents are allowed"
        ),
        false
      );
    }

    cb(null, true);
  },
}).single("file");

module.exports = {
  uploadImage,
  uploadVideo,
  uploadImagesOrDocuments,
};
