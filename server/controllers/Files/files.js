const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { responseHandler } = require("../../helpers/processHandle");

// Root uploads folder
const uploadFolder = path.join(process.cwd(), "uploads");

// Ensure the "uploads" folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const allowedMimetypes = [
      "application/pdf",
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype.toLowerCase();

    if (
      allowedExtensions.includes(extname) &&
      allowedMimetypes.includes(mimetype)
    ) {
      return cb(null, true);
    }

    // Provide a clearer error message
    cb(
      new Error("Only PDF, JPEG, JPG, PNG, and WebP files are allowed!"),
      false
    );
  },
}).array("files");

// Controller for Bulk File Upload
const uploadFiles = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return responseHandler.error(
        res,
        err?.message || "Error uploading files",
        500,
        err
      );
    }

    if (!req.files || req.files.length === 0) {
      return responseHandler.error(res, "No files uploaded", 400);
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    }));

    return responseHandler.success(res, files, "Files uploaded successfully!");
  });
};

// Controller for Single File Download
const downloadFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadFolder, fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        return responseHandler.error(
          res,
          "Error downloading the file.",
          500,
          err
        );
      }
    });
  } else {
    return responseHandler.error(res, "File not found", 404);
  }
};

// Controller for Single File Update
const updateFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadFolder, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);

    upload(req, res, (err) => {
      if (err) {
        return responseHandler.error(res, "Error uploading the file", 500, err);
      }

      if (!req.files || req.files.length === 0) {
        return responseHandler.error(res, "No file uploaded for update", 400);
      }

      const newFile = req.files[0];

      return responseHandler.success(
        res,
        {
          filename: newFile.filename,
          url: `/uploads/${newFile.filename}`,
        },
        "File updated successfully!"
      );
    });
  } else {
    return responseHandler.error(res, "File to update not found", 404);
  }
};

// Controller for Single File Delete
const deleteFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadFolder, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return responseHandler.success(
      res,
      {
        deletedFileUrl: `/uploads/${fileName}`,
      },
      "File deleted successfully"
    );
  } else {
    return responseHandler.error(res, "File not found", 404);
  }
};

module.exports = {
  upload,
  uploadFiles,
  downloadFile,
  updateFile,
  deleteFile,
};
