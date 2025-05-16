const handle = (promise) => {
  return promise
    .then((data) => [data, null])
    .catch((error) => Promise.resolve([null, error]));
};

const responseHandler = {
  /**
   * Handles successful responses.
   * @param {Object} res - Express response object
   * @param {Object} data - Response data (default: empty object)
   * @param {string} message - Success message (default: "Success")
   * @param {number} status - HTTP status code (default: 200)
   */
  success: (res, data = {}, message = "Success", status = 200) => {
    res.status(status).json({ success: true, message, data });
  },

  /**
   * Handles error responses.
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "An error occurred")
   * @param {number} status - HTTP status code (default: 500)
   * @param {Object|null} details - Additional error details (optional)
   */
  error: (res, message = "An error occurred", status = 500, details = null) => {
    res
      .status(status)
      .json({ success: false, message, ...(details && { details }) });
  },

  /**
   * Handles 404 Not Found responses.
   * @param {Object} res - Express response object
   * @param {string} message - Not found message (default: "Resource not found")
   */
  notFound: (res, message = "Resource not found") => {
    responseHandler.error(res, message, 404);
  },

  /**
   * Handles 401 Unauthorized responses.
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message (default: "Unauthorized access")
   */
  unauthorized: (res, message = "Unauthorized access") => {
    responseHandler.error(res, message, 401);
  },

  /**
   * Handles 403 Forbidden responses.
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message (default: "Access forbidden")
   */
  forbidden: (res, message = "Access forbidden") => {
    responseHandler.error(res, message, 403);
  },
};

function filterObjectBySchema(payload, schema) {
  const filter = (obj, schema) => {
    if (!obj || typeof obj !== "object") return {}; // Ensure obj is an object

    if (Array.isArray(schema)) {
      if (!Array.isArray(obj)) return []; // If obj is not an array, return empty array

      // Handle array of strings or objects based on schema type
      if (typeof schema[0] === "boolean" && typeof obj[0] === "string") {
        return [...obj]; // Simply return the array of strings as is
      }

      // Recursively filter arrays of objects based on schema
      return obj
        .map((item) => filter(item, schema[0])) // Apply filtering to each item
        .filter(
          (item) => typeof item === "object" && Object.keys(item).length > 0
        ); // Keep non-empty objects
    }

    if (typeof schema === "object" && schema !== null) {
      const result = {};

      for (const key in schema) {
        if (schema[key] === true && obj[key] !== undefined) {
          // If the schema key is true, and obj has a defined value for key
          result[key] = obj[key];
        } else if (typeof schema[key] === "object" && obj[key]) {
          // Recursively process nested objects or arrays if obj[key] exists
          const nestedValue = filter(obj[key], schema[key]);

          if (Array.isArray(schema[key])) {
            result[key] = Array.isArray(nestedValue) ? nestedValue : [];
          } else if (
            typeof nestedValue === "object" &&
            Object.keys(nestedValue).length > 0
          ) {
            result[key] = nestedValue;
          }
        }
      }

      return result;
    }

    return {}; // Return empty object if schema is not an object
  };

  return filter(payload, schema);
}

module.exports = { handle, responseHandler, filterObjectBySchema };
