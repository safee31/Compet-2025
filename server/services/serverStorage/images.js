const path = require("path");
const fs = require("fs").promises;
const { isImageValid, convertToWebP } = require("../../utils/files");

const uploadImagesToServer = async ({ files, folder }) => {
  const results = [];
  // Physical storage path (server filesystem)
  const physicalUploadDir = path.join(process.cwd(), "uploads", folder);

  // Create the upload directory if it doesn't exist
  try {
    await fs.access(physicalUploadDir);
  } catch (err) {
    await fs.mkdir(physicalUploadDir, { recursive: true });
  }

  for (const file of files) {
    try {
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
      const physicalFilePath = path.join(physicalUploadDir, fileName);

      // Write the file to disk
      await fs.writeFile(physicalFilePath, buffer);

      // Return path in the format: /{folder}/filename.ext
      results.push({
        fileName,
        filePath: `/${folder}/${fileName}`, // Format you requested
      });

      // Remove temporary file if it exists
      if (file.path) await fs.unlink(file.path);
    } catch (error) {
      console.error(
        `Failed to process image on server "${file.originalname}": ${err.message}`
      );
      throw error;
    }
  }
  return results;
};

module.exports = { uploadImagesToServer };
