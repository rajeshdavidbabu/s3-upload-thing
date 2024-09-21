'use server';

import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { getDownloadUrl, getUploadParams } from './core';

// Configuration object
const uploadConfig = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
};

export async function getS3UploadParams(filename: string, contentType: string, sizeBytes: number) {
  // Validate file size
  if (sizeBytes > uploadConfig.maxSizeBytes) {
    throw new Error(`File size exceeds the maximum limit of ${uploadConfig.maxSizeBytes / (1024 * 1024)}MB`);
  }

  // Validate file type
  if (!uploadConfig.allowedMimeTypes.includes(contentType)) {
    throw new Error(`File type ${contentType} is not allowed. Allowed types are: ${uploadConfig.allowedMimeTypes.join(', ')}`);
  }

  // If validation passes, proceed with getting upload params
  const response = await getUploadParams({ filename, contentType });
  const data = await response.json() as PresignedPost;
  
  return data;
}

export async function getS3DownloadUrl(key: string) {
  const response = await getDownloadUrl(key);
  const data = await response.json() as { url: string };
  return data.url;
}

