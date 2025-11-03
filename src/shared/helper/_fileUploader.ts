import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "@/config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const base64Data = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const uploadResult = await cloudinary.uploader
    .upload(base64Data, {
      folder: "uploads",
      public_id: `${file.fieldname}-${Date.now()}`,
    })
    .catch((error) => {
      console.error("Cloudinary upload error:", error);
      throw error;
    });

  return uploadResult;
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
