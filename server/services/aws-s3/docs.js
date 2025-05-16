const fs = require("fs").promises;
const { validateKey } = require("../../utils/aws-s3");
const { uploadToS3 } = require("./s3-bucket");

// Allowed document types and their extensions
const ALLOWED_DOC_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "text/plain": ".txt",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
};

const validateDocument = (file) => {
  if (!ALLOWED_DOC_TYPES[file.mimetype]) {
    throw new Error(`Unsupported document type: ${file.mimetype}`);
  }
};

const uploadDocs = async ({ files, folder }) => {
  const results = [];

  for (const file of files) {
    validateDocument(file);

    const buffer = file.buffer || (await fs.readFile(file.path));
    const ext = ALLOWED_DOC_TYPES[file.mimetype];
    const sanitizedName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/\.[^/.]+$/, "");

    const fileName = `${Date.now()}-${sanitizedName}${ext}`;

    const uploaded = await uploadToS3({
      fileBuffer: buffer,
      fileName,
      mimeType: file.mimetype,
      folder,
    });

    results.push({
      fileName,
      s3Key: `/${uploaded.Key}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    if (file.path) await fs.unlink(file.path);
  }

  return results;
};

module.exports = { uploadDocs, validateDocument };
