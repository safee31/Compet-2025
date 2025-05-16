const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs").promises;

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = require("../../config");
const { extractFolderAndFilename, validateKey } = require("../../utils/aws-s3");

// Initialize the S3 client
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
const uploadToS3 = async ({ fileBuffer, fileName, mimeType, folder }) => {
  if (!fileBuffer || !fileName || !mimeType || !folder) {
    console.error({ fileBuffer, fileName, mimeType, folder });
    throw new Error("Missing required parameters for uploading to S3.");
  }

  const Key = `${folder}/${fileName}`;

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key,
    Body: fileBuffer,
    ContentType: mimeType,
    // Optional: Add ContentDisposition for download control
    // ContentDisposition: 'attachment; filename="' + fileName + '"',
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);

    // Return similar structure to v2's upload().promise()
    return {
      ...data,
      Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${Key}`,
      Key,
      Bucket: AWS_BUCKET_NAME,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3.");
  }
};

const deleteFileFromS3 = async ({ fileName, folder }) => {
  if (!fileName || !folder) {
    console.error({ fileName, folder });
    throw new Error("Missing required parameters for deleting file from S3.");
  }

  const Key = `${folder}/${fileName}`;

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    const data = await s3.send(command);

    return {
      ...data,
      Key,
      Bucket: AWS_BUCKET_NAME,
    };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3.");
  }
};
const getStreamFromS3 = async (key) => {
  if (!key) throw new Error("Missing S3 key");

  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key.startsWith("/") ? key.slice(1) : key,
  });

  const { Body, ContentType, ContentLength } = await s3.send(command);

  return {
    stream: Body,
    contentType:
      ContentType ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    contentLength: ContentLength,
  };
};

const updateFileToS3 = async ({ file, originalKey }) => {
  // Validate the key format
  validateKey(originalKey);

  const { folder, fileName } = extractFolderAndFilename(originalKey);

  // Prepare the file buffer and metadata
  const buffer = file.buffer || (await fs.readFile(file.path));
  const mimeType = file.mimetype;

  // Upload the new file to S3, replacing the file with the same key (originalKey)
  const uploaded = await uploadToS3({
    fileBuffer: buffer,
    fileName, // We are using the same file name
    mimeType,
    folder,
  });
  // Return the result of the uploaded file
  return {
    fileName: originalKey, // We are using the same name
    s3Key: `/${uploaded.Key}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
  };
};

module.exports = {
  uploadToS3,
  deleteFileFromS3,
  getStreamFromS3,
  updateFileToS3,
};
