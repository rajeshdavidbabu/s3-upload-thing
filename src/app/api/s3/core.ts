"use server"

import { env } from "@/env"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"

interface GetUploadParams {
  filename: string
  contentType: string
}

const s3Client = new S3Client({ region: env.AWS_REGION })

export async function getUploadParams({
  filename,
  contentType,
}: GetUploadParams) {
  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: env.AWS_BUCKET_NAME,
      Key: uuidv4(),
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })

    return Response.json({ url, fields })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message })
    }
    return Response.json({ error: "Unknown error" })
  }
}

export async function getDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    })
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return Response.json({ url })
  } catch (error) {
    return Response.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    )
  }
}
