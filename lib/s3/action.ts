"use server";

import { verifySession, sampleVerifySession } from "@/app/auth/utils";
import { deleteFile, getDownloadUrl, getUploadParams } from "./core";
import {
  getFileKeys,
  insertFileRecords,
  deleteFileRecord,
} from "@/db/api/file";
import { UploadedFile } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Configuration object
const uploadConfig = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
};

export async function getS3UploadParams(
  filename: string,
  contentType: string,
  sizeBytes: number,
) {
  await verifySession();

  // Validate file size
  if (sizeBytes > uploadConfig.maxSizeBytes) {
    throw new Error(
      `File size exceeds the maximum limit of ${uploadConfig.maxSizeBytes / (1024 * 1024)}MB`,
    );
  }

  // Validate file type
  if (!uploadConfig.allowedMimeTypes.includes(contentType)) {
    throw new Error(
      `File type ${contentType} is not allowed. Allowed types are: ${uploadConfig.allowedMimeTypes.join(", ")}`,
    );
  }

  // If validation passes, proceed with getting upload params
  const response = await getUploadParams({ filename, contentType });

  return response;
}

export async function getS3DownloadUrl(key: string) {
  await verifySession();

  const { url } = await getDownloadUrl(key);

  return url;
}

export async function deleteFileFromS3(key: string) {
  await verifySession();

  const { success } = await deleteFile(key);

  return { success };
}

export async function getFilesFromDB(page: number = 1, pageSize: number = 20) {
  const { userId } = await verifySession();

  return getFileKeys(userId, page, pageSize);
}

export async function uploadFilesToDB(files: UploadedFile[]) {
  const { userId } = await verifySession();

  try {
    await insertFileRecords(userId, files);
    // Revalidate the dashboard page after successful upload
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error uploading files:", error);
    return { success: false };
  }
}

export async function deleteFileFromDB(fileKey: string) {
  const { userId } = await verifySession();

  try {
    // Delete the file record from the database
    await deleteFileRecord(userId, fileKey);
    // Revalidate the dashboard page after successful deletion
    revalidatePath("/dashboard");

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, message: "Failed to delete file" };
  }
}
