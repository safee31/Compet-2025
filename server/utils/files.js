const sharp = require("sharp");

const MAX_IMAGE_SIZE_MB = 5;
const MAX_PDF_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 100;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mov",
  "video/webm",
  "video/avi",
  "video/quicktime",
];

const isImageValid = (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Unsupported image type: ${file.mimetype}. Allowed: jpeg, png, webp.`
    );
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`);
  }
  return true;
};

const isPdfValid = (file) => {
  if (!ALLOWED_PDF_TYPES.includes(file.mimetype)) {
    throw new Error(`Only PDF files are allowed.`);
  }
  if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
    throw new Error(`PDF exceeds ${MAX_PDF_SIZE_MB}MB limit.`);
  }
  return true;
};

const isVideoValid = (file) => {
  if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Unsupported video format: ${file.mimetype}. Allowed: mp4, mov, webm, avi.`
    );
  }
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    throw new Error(`Video exceeds ${MAX_VIDEO_SIZE_MB}MB limit.`);
  }
  return true;
};

const convertToWebP = async (buffer) => {
  const resultBuffer = await sharp(buffer).webp().toBuffer();
  return { buffer: resultBuffer };
};

module.exports = {
  isImageValid,
  isPdfValid,
  isVideoValid,
  convertToWebP,
};
