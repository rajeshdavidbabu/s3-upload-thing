"use server";

import { verifySession } from "@/app/auth/utils";
import {
  deleteFile,
  getDownloadUrl,
  getThumbnailDownloadUrl,
  getUploadParams,
} from "./core";
import {
  insertFileRecords,
  deleteFileRecord,
  getFileInfo,
  checkUserFileAccess,
} from "@/db/api/file";
import { UploadedFile } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  trackBandwidthUsage,
  trackStorageChange,
  getUserUsage as getUserUsageFromDB,
} from "@/db/api/usage";

// Configuration object
const uploadConfig = {
  maxSizeBytes: 500 * 1024 * 1024, // 500MB
};

export async function getS3UploadParams(
  filename: string,
  contentType: string,
  sizeBytes: number
) {
  await verifySession();

  // Validate file size
  if (sizeBytes > uploadConfig.maxSizeBytes) {
    throw new Error(
      `File size exceeds the maximum limit of ${uploadConfig.maxSizeBytes / (1024 * 1024)}MB`
    );
  }

  // If validation passes, proceed with getting upload params
  const response = await getUploadParams({ filename, contentType });

  return response;
}

export async function getS3DownloadUrl(key: string) {
  const { userId } = await verifySession();
  const checkAccess = await checkUserFileAccess(userId, key);

  if (!checkAccess) {
    throw new Error("Access denied");
  }

  const { url, size } = await getDownloadUrl(key);

  if (size && url) {
    await trackBandwidthUsage(userId, size);
  }

  return url;
}

export async function getS3ThumbnailDownloadUrl(key: string) {
  const { userId } = await verifySession();
  const checkAccess = await checkUserFileAccess(userId, key);

  if (!checkAccess) {
    throw new Error("Access denied");
  }

  const { url } = await getThumbnailDownloadUrl(key);

  return url;
}

export async function deleteFileFromS3(key: string) {
  const { userId } = await verifySession();
  const checkAccess = await checkUserFileAccess(userId, key);

  if (!checkAccess) {
    throw new Error("Access denied");
  }

  const { success } = await deleteFile(key);

  return { success };
}