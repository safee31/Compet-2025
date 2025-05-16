import { API_BASE_URL, AWS_BUCKET_NAME, AWS_REGION } from "../constants";

export const validateFiles = (
  files = [], // Accept multiple files as an array
  allowedFormats = ["application/pdf"], // Only allow PDFs
  maxSizeMB = 5 // Example: Set max file size to 5MB
) => {
  if (!files.length)
    return { valid: false, message: "Please select at least one file." };

  let errors = [];

  for (const file of files) {
    // Validate file type
    if (!allowedFormats.includes(file.type)) {
      errors.push(
        `Invalid file format: ${file.name}. Please upload only ${String(
          allowedFormats
        )} files.`
      );
      continue;
    }

    // Validate file size (convert MB to bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(
        `File too large: ${file.name}. Maximum allowed size is ${maxSizeMB}MB.`
      );
    }
  }

  if (errors.length) {
    return { valid: false, message: errors.join(" ") };
  }

  return { valid: true, message: "All files are valid and ready to upload." };
};
export const createFormData = (files, fieldName = "files") => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error(
      "Invalid files array. It should contain at least one valid File object."
    );
  }

  const formData = new FormData();

  files.forEach((file) => {
    if (!(file instanceof File)) {
      throw new Error(
        "Invalid file object. Ensure each item is a File instance."
      );
    }

    formData.append(fieldName, file, file.name);
  });

  return formData;
};

export const objectToFormData = (
  obj,
  form = new FormData(),
  namespace = ""
) => {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key) || obj[key] === undefined || obj[key] === null)
      continue;

    const formKey = namespace ? `${namespace}[${key}]` : key;
    const value = obj[key];

    if (value instanceof File) {
      form.append(formKey, value);
    } else if (typeof value === "object" && !(value instanceof Date)) {
      objectToFormData(value, form, formKey); // recursive for nested object
    } else {
      form.append(formKey, value);
    }
  }

  return form;
};

export const generateImgPath = (path = "") => {
  return path?.trim() ? `${API_BASE_URL}${path}` : "";
};
export const generateS3FilePath = (path = "") => {
  const S3_BASE_URL = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;

  return path?.trim() ? `${S3_BASE_URL}${path}` : "";
};
