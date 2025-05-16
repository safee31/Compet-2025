const path = require("path");
const fs = require("fs").promises;
const { isVideoValid } = require("../../utils/files");

const uploadVideosToServer = async ({ files, folder }) => {
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
      isVideoValid(file);

      const ext = path.extname(file.originalname).toLowerCase();
      // const mimeType = file.mimetype;
      const buffer = file.buffer || (await fs.readFile(file.path));

      const sanitizedName = file.originalname
        .replace(/\s+/g, "_")
        .replace(/\.[^/.]+$/, ""); // More reliable extension removal
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
    } catch (err) {
      console.error(
        `Failed to process video on server "${file.originalname}": ${err.message}`
      );
      throw err;
    }
  }

  return results;
};

module.exports = { uploadVideosToServer };
