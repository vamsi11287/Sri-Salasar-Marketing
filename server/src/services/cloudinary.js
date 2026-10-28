import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Ensure Cloudinary is configured with latest process.env values
export const configureCloudinary = () => {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const api_key = (process.env.CLOUDINARY_API_KEY || "").trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || "").trim();

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true
  });

  return { cloud_name, api_key, api_secret };
};

export const isCloudinaryConfigured = () => {
  const { cloud_name, api_key, api_secret } = configureCloudinary();
  return Boolean(
    cloud_name &&
    api_key &&
    api_secret &&
    cloud_name !== "your_cloud_name"
  );
};

/**
 * Upload in-memory buffer directly to Cloudinary without writing to disk
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format
      });
    });
    uploadStream.end(buffer);
  });
};

/**
 * Upload an image (buffer or file path) to Cloudinary
 */
export const uploadToCloudinary = async (source, folder = "sri-salasar-products") => {
  configureCloudinary();

  try {
    if (Buffer.isBuffer(source)) {
      return await uploadBufferToCloudinary(source, {
        folder,
        resource_type: "image"
      });
    }

    const result = await cloudinary.uploader.upload(source, {
      folder,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    if (fs.existsSync(source)) {
      try {
        fs.unlinkSync(source);
      } catch (err) {
        console.warn("Could not remove temp file:", err.message);
      }
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (typeof source === "string" && fs.existsSync(source)) {
      try {
        fs.unlinkSync(source);
      } catch (err) {}
    }
    throw error;
  }
};

/**
 * Upload a PDF document (buffer or file path) to Cloudinary
 */
export const uploadPdfToCloudinary = async (source, folder = "sri-salasar-documents") => {
  configureCloudinary();

  try {
    if (Buffer.isBuffer(source)) {
      return await uploadBufferToCloudinary(source, {
        folder,
        resource_type: "auto"
      });
    }

    const result = await cloudinary.uploader.upload(source, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    if (fs.existsSync(source)) {
      try {
        fs.unlinkSync(source);
      } catch (err) {
        console.warn("Could not remove temp PDF file:", err.message);
      }
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    };
  } catch (error) {
    console.error("Cloudinary PDF upload error:", error);
    if (typeof source === "string" && fs.existsSync(source)) {
      try {
        fs.unlinkSync(source);
      } catch (err) {}
    }
    throw error;
  }
};

/**
 * Delete a media item (image or raw file) from Cloudinary
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return { success: false, message: "No publicId provided" };

  configureCloudinary();

  try {
    let result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    
    // If not found as image, try raw resource type or auto
    if (result && result.result === "not found" && resourceType === "image") {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }

    console.log(`Cloudinary item deleted: ${publicId} (result: ${result?.result})`);
    return { success: true, result };
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Extract Cloudinary public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/dwhyaucj4/image/upload/v1793074936/sri-salasar-products/vamsi_photo_123.png
 * Returns: sri-salasar-products/vamsi_photo_123
 */
export const extractPublicIdFromCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const pathAfterUpload = url.substring(uploadIndex + "/upload/".length);

    // Look for version tag like v123456789/
    const versionMatch = pathAfterUpload.match(/(?:^|\/)(v\d+)\/(.+)$/);
    let publicIdWithExt = "";

    if (versionMatch) {
      publicIdWithExt = versionMatch[2];
    } else {
      const parts = pathAfterUpload.split("/");
      while (parts.length > 1 && (parts[0].includes(",") || (parts[0].includes("_") && !parts[0].startsWith("sri-salasar")))) {
        parts.shift();
      }
      publicIdWithExt = parts.join("/");
    }

    // Strip extension
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;

    return decodeURIComponent(publicId);
  } catch (err) {
    console.error("Error extracting public_id from Cloudinary URL:", err);
    return null;
  }
};

export default cloudinary;
