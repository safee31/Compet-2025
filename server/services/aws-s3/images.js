const path = require("path");
const fs = require("fs").promises;
const { isImageValid, convertToWebP } = require("../../utils/files");
const { uploadToS3 } = require("./s3-bucket");

const uploadImages = async ({ files, folder }) => {
  const results = [];

  for (const file of files) {
    isImageValid(file);

    let buffer = file.buffer || (await fs.readFile(file.path));
    let ext = path.extname(file.originalname).toLowerCase();
    let mimeType = file.mimetype;

    if (mimeType !== "image/webp") {
      const converted = await convertToWebP(buffer);
      buffer = converted.buffer;
      ext = ".webp";
      mimeType = "image/webp";
    }

    const sanitizedName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/\.[^/.]+$/, "");

    const fileName = `${Date.now()}-${sanitizedName}${ext}`;

    const uploaded = await uploadToS3({
      fileBuffer: buffer,
      fileName,
      mimeType,
      folder,
    });

    const objectKey = `/${uploaded.Key}`;
    // Push success result with relative path
    results.push({ fileName, s3Key: objectKey });
    if (file.path) await fs.unlink(file.path);
  }
  return results;
};

module.exports = { uploadImages };
