"use server";

import { verifySession } from "@/app/auth/utils";
import { deleteFile, getDownloadUrl, getThumbnailDownloadUrl, getUploadParams } from "./core";
import {
  insertFileRecords,
  deleteFileRecord,
  getFileInfo,
} from "@/db/api/file";
import { UploadedFile } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { trackBandwidthUsage, trackStorageChange, getUserUsage as getUserUsageFromDB  } from "@/db/api/usage";

// Configuration object
const uploadConfig = {
  maxSizeBytes: 500 * 1024 * 1024, // 500MB
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

  // If validation passes, proceed with getting upload params
  const response = await getUploadParams({ filename, contentType });

  return response;
}

export async function getS3DownloadUrl(key: string) {
  const { userId } = await verifySession();

  const { url, size } = await getDownloadUrl(key);

  // Track potential bandwidth usage
  if (size) {
    await trackBandwidthUsage(userId, size);
  }

  console.log('Downloaded file size ', size);

  return url;
}

export async function getS3ThumbnailDownloadUrl(key: string) {
  await verifySession();

  const { url } = await getThumbnailDownloadUrl(key);

  return url;
}

export async function deleteFileFromS3(key: string) {
  await verifySession();

  const { success } = await deleteFile(key);

  return { success };
}

export async function getFilesFromDB(page: number, pageSize: number, selectedFileTypes: string[], fileName?: string) {
  const { userId } = await verifySession();

  return getFileInfo(userId, page, pageSize, selectedFileTypes, fileName);
}

export async function uploadFilesToDB(files: UploadedFile[]) {
  const { userId } = await verifySession();

  try {
    await insertFileRecords(userId, files);

    // Track storage increase
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    await trackStorageChange(userId, totalSize);

    // Wait for 2 seconds for thumbnails to be generated
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Revalidate the dashboard page after successful upload
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error uploading files:", error);
    return { success: false };
  }
}

export async function deleteFileFromDB(fileKey: string, size: number) {
  const { userId } = await verifySession();

  console.log('Incoming size ', size);

  try {
    // Delete the file record from the database
    await deleteFileRecord(userId, fileKey);

    if (size > 0) {     
      // Track storage decrease
      await trackStorageChange(userId, -size);
    }

    // Revalidate the dashboard page after successful deletion
    revalidatePath("/dashboard");

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, message: "Failed to delete file" };
  }
}


export async function getUserUsage() {
  const { userId } = await verifySession();

  return getUserUsageFromDB(userId);
}