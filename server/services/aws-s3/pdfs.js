const { isPdfValid } = require("../../utils/files");
const { uploadToS3 } = require("./s3-bucket");
const fs = require("fs").promises;

const uploadPdfs = async ({ files, folder }) => {
  const results = [];

  for (const file of files) {
    isPdfValid(file);

    const ext = ".pdf";
    const mimeType = "application/pdf";
    let buffer = file.buffer || (await fs.readFile(file.path));
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
  }

  return results;
};

module.exports = { uploadPdfs };
