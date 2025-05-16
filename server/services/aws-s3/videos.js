const path = require("path");
const fs = require("fs").promises;
const { isVideoValid } = require("../../utils/files");
const { uploadToS3 } = require("./s3-bucket");

const uploadVideos = async ({ files, folder }) => {
  const results = [];

  for (const file of files) {
    try {
      isVideoValid(file);

      const ext = path.extname(file.originalname).toLowerCase();
      const mimeType = file.mimetype;
      const buffer = file.buffer || (await fs.readFile(file.path));

      const sanitizedName = file.originalname
        .replace(/\s+/g, "_")
        .replace(ext, "");
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
    } catch (err) {
      throw new Error(
        `Failed to process video "${file.originalname}": ${err.message}`
      );
    }
  }

  return results;
};

module.exports = { uploadVideos };
