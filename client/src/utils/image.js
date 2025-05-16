import Compressor from "compressorjs";

// Utility function to convert images to WebP format and compress them
export const convertAndCompressImages = async (files) => {
  const convertedFiles = [];

  // Ensure files are an array of File instances
  const fileArray = Array.isArray(files) ? files : [files];

  for (let file of fileArray) {
    if (!(file instanceof File)) {
      console.error("Invalid file instance:", file);
      continue;
    }

    const extname = file.name.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png"].includes(extname)) {
      try {
        // Create a new Promise to handle the compression and conversion
        const compressedFile = await new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.8, // Set the image quality (adjustable)
            maxWidth: 1024, // Set max width (adjustable)
            maxHeight: 1024, // Set max height (adjustable)
            convertSize: 3 * 1024 * 1024, // Convert if > 3MB
            mimeType: "image/webp", // Convert to WebP format
            success(result) {
              // Convert Blob to File instance
              const convertedFile = new File(
                [result],
                file.name.replace(/\.[^/.]+$/, ".webp"),
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                }
              );
              resolve(convertedFile);
            },
            error(err) {
              reject(err);
            },
          });
        });

        convertedFiles.push(compressedFile); // Add the compressed WebP file to the array
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    } else {
      // If the file is already WebP, just add it without conversion
      convertedFiles.push(file);
    }
  }

  return convertedFiles;
};
