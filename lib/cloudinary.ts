"use server";

import { v2 as cloud } from "cloudinary";

export async function cloudinary({
  file,
  audio,
  action,
  public_id,
}: {
  file?: string;
  audio?: boolean;
  action: "upload" | "destroy";
  public_id?: string;
}) {
  cloud.config({
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (action === "upload") {
    if (!file) {
      throw new Error("file required");
    }

    const data = await cloud.uploader.upload(file, {
      resource_type: audio ? "video" : "image",
    });

    return {
      fileURL: data.url,
      fileName: data.original_filename,
      fileID: data.public_id,
    };
  }

  if (action === "destroy") {
    if (!public_id) {
      throw new Error("public id of file is required");
    }

    await cloud.uploader.destroy(public_id);

    return;
  }
}
