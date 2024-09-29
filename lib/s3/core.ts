import "server-only";

import { env } from "@/lib/env.server";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

interface GetUploadParams {
  filename: string;
  contentType: string;
}

const s3Client = new S3Client({ region: env.AWS_REGION });

export async function getUploadParams({ contentType }: GetUploadParams) {
  try {
    const key = uuidv4();

    console.log("Key generated used for upload ", key);

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Conditions: [
        ["content-length-range", 0, 524288000], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    console.log(
      "Presigned URL generated for upload ",
      JSON.stringify(fields, null, 2),
    );

    return { url, fields };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Unknown error" };
  }
}

export async function getDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      // ResponseCacheControl: "public, max-age=3599",
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url };
  } catch (error) {
    return { error: "Failed to generate download URL" };
  }
}

export async function getThumbnailDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_THUMBNAIL_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url };
  } catch (error) {
    return { error: "Failed to generate thumbnail download URL" };
  }
}

export async function checkS3ObjectExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: env.AWS_THUMBNAIL_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (error) {
    console.log("Error checking if object exists in S3:", error);
    return false;
  }
}


export async function deleteFile(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete file from S3 Bucket" };
  }
}
