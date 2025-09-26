"use server";

import { v2 as cloudinary } from "cloudinary";

export const cloudinarySignature = async (
  file: string,
  type: "audio" | "image"
) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET!
  );

  const apiURL = `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/${type === "audio" ? "video" : "image"}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY!);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  return [apiURL, formData];
};
